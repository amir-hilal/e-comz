import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1';

  constructor(private http: HttpClient) {}

  // Fetch current weather data
  getCurrentWeather(
    latitude: number,
    longitude: number,
    timezone: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('current_weather', 'true')
      .set('timezone', timezone);
    return this.http.get(`${this.apiUrl}/forecast`, { params });
  }

  // Fetch weather forecast data
  getWeatherForecast(
    latitude: number,
    longitude: number,
    timezone: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum')
      .set('timezone', timezone);
    return this.http.get(`${this.apiUrl}/forecast`, { params });
  }

  // Fetch historical weather data
  getHistoricalWeather(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
    timezone: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set('timezone', timezone);
    return this.http.get(`${this.apiUrl}/historical`, { params });
  }
}
