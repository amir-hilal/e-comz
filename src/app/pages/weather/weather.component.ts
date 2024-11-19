import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    CommonModule,
    MatProgressSpinnerModule,
  ],
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

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Fetch data for the first tab initially
    this.loadCityWeather(this.cities[0]);
  }

  async loadCityWeather(city: any): Promise<void> {
    const cityKey = city.name;

    if (this.weatherData[cityKey]) {
      // Data already loaded, no need to re-fetch
      return;
    }

    this.loadingStates[cityKey] = true;
    this.errors[cityKey] = null;

    try {
      const data = await this.weatherService.fetchWeatherData({
        latitude: city.latitude,
        longitude: city.longitude,
        start_date: '2024-11-04',
        end_date: '2024-11-17',
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
