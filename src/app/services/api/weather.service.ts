import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://historical-forecast-api.open-meteo.com/v1/forecast';

  async fetchWeatherData(params: any): Promise<any> {
    try {
      const responses = await fetchWeatherApi(this.apiUrl, params);
      const response = responses[0]; // Process the first location or add logic for multiple
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly();

      const weatherData = {
        hourly: {
          time: this.generateTimeRange(
            Number(hourly?.time() || 0),
            Number(hourly?.timeEnd() || 0),
            hourly?.interval() || 3600,
            utcOffsetSeconds
          ),
          temperature2m: hourly?.variables(0)?.valuesArray() || [],
        },
      };

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  private generateTimeRange(
    start: number,
    stop: number,
    step: number,
    offset: number
  ): Date[] {
    return Array.from(
      { length: (stop - start) / step },
      (_, i) => new Date((start + i * step + offset) * 1000)
    );
  }
}
