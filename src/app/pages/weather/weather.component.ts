import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/api/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  isLoading = false;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeatherData();
  }

  async loadWeatherData(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    const params = {
      latitude: 52.52,
      longitude: 13.41,
      start_date: '2024-11-04',
      end_date: '2024-11-17',
      hourly: 'temperature_2m',
    };

    try {
      this.weatherData = await this.weatherService.fetchWeatherData(params);
    } catch (err) {
      this.error = 'Failed to load weather data';
    } finally {
      this.isLoading = false;
    }
  }
}
