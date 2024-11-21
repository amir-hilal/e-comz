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

      if (!responses || responses.length === 0) {
        throw new Error('No response data from the API');
      }

      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly();

      const timeStart = Number(hourly?.time() || 0);
      const timeEnd = Number(hourly?.timeEnd() || 0);
      const timeInterval = hourly?.interval() || 3600;

      const timeData = this.generateTimeRange(
        timeStart,
        timeEnd,
        timeInterval,
        utcOffsetSeconds
      );
      const temperature2m = Array.from(
        hourly?.variables(0)?.valuesArray() || []
      );

      // Ensure time and temperature arrays match in length
      if (timeData.length !== temperature2m.length) {
        throw new Error('Mismatch between time and temperature data length');
      }

      const weatherData = {
        hourly: {
          time: timeData,
          temperature2m: temperature2m,
        },
      };

      console.log('Processed weather data:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error in fetchWeatherData:', error);
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
