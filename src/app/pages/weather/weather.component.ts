import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { WeatherService } from '../../services/api/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
  ],
  providers: [MatDatepickerModule],
})
export class WeatherComponent implements OnInit {
  cities = [
    { name: 'Berlin', latitude: 52.52, longitude: 13.41 },
    { name: 'London', latitude: 51.51, longitude: -0.13 },
    { name: 'New York', latitude: 40.71, longitude: -74.01 },
  ];

  weatherData: { [key: string]: MatTableDataSource<any> } = {};
  loadingStates: { [key: string]: boolean } = {};
  errors: { [key: string]: string | null } = {};
  timeLoaded: { [key: string]: string } = {};
  lastFetchedDateRange: { [key: string]: { start: string; end: string } } = {};

  dateRange = {
    start: new Date('2024-11-04'), // Default start date
    end: new Date('2024-11-17'), // Default end date
  };

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Fetch data for the first tab initially
    this.loadCityWeather(this.cities[0]);
  }

  async loadCityWeather(city: any): Promise<void> {
    const cityKey = city.name;

    if (!this.dateRange.start || !this.dateRange.end) {
      this.errors[cityKey] = 'Please select a valid date range.';
      return;
    }

    const newDateRange = {
      start: this.dateRange.start.toISOString().split('T')[0],
      end: this.dateRange.end.toISOString().split('T')[0],
    };

    // Check if data has already been fetched for this city with the same date range
    const lastRange = this.lastFetchedDateRange[cityKey];
    if (
      this.weatherData[cityKey] &&
      lastRange?.start === newDateRange.start &&
      lastRange?.end === newDateRange.end
    ) {
      return; // No need to refetch data
    }

    this.loadingStates[cityKey] = true;
    this.errors[cityKey] = null;

    try {
      const data = await this.weatherService.fetchWeatherData({
        latitude: city.latitude,
        longitude: city.longitude,
        start_date: newDateRange.start,
        end_date: newDateRange.end,
        hourly: 'temperature_2m',
      });

      const dataSource = new MatTableDataSource(
        data.hourly.temperature2m.map((temp: number, index: number) => ({
          time: data.hourly.time[index],
          temperature: temp,
        }))
      );

      this.weatherData[cityKey] = dataSource;
      this.timeLoaded[cityKey] = new Date().toISOString();
      this.lastFetchedDateRange[cityKey] = newDateRange; // Update the fetched date range
    } catch (err) {
      this.errors[cityKey] = `Failed to load weather data for ${city.name}`;
    } finally {
      this.loadingStates[cityKey] = false;
    }
  }

  onTabChange(index: number): void {
    const city = this.cities[index];
    this.loadCityWeather(city);
  }
}
