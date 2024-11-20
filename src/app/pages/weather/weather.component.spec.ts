import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WeatherService } from '../../services/api/weather.service';
import { WeatherComponent } from './weather.component';

class MockWeatherService {
  fetchWeatherData = jasmine.createSpy('fetchWeatherData').and.returnValue(
    Promise.resolve({
      hourly: {
        time: ['2024-11-04T00:00:00Z', '2024-11-04T01:00:00Z'],
        temperature2m: [10, 12],
      },
    })
  );
}

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: MockWeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherComponent, BrowserAnimationsModule],
      providers: [{ provide: WeatherService, useClass: MockWeatherService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(
      WeatherService
    ) as unknown as MockWeatherService;

    fixture.detectChanges();
  });

  afterEach(() => {
    weatherService.fetchWeatherData.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load weather data for the first city', async () => {
    await component.loadCityWeather(component.cities[0]);

    const cityKey = component.cities[0].name;
    expect(weatherService.fetchWeatherData).toHaveBeenCalledWith({
      latitude: 52.52,
      longitude: 13.41,
      start_date: '2024-11-04',
      end_date: '2024-11-17',
      hourly: 'temperature_2m',
    });

    expect(component.weatherData[cityKey]).toBeTruthy();
    expect(
      component.weatherData[cityKey] instanceof MatTableDataSource
    ).toBeTrue();
    expect(component.weatherData[cityKey].data).toEqual([
      { time: '2024-11-04T00:00:00Z', temperature: 10 },
      { time: '2024-11-04T01:00:00Z', temperature: 12 },
    ]);
    expect(component.timeLoaded[cityKey]).toBeDefined();
  });

  it('should not re-fetch weather data if the date range has not changed', async () => {
    await component.loadCityWeather(component.cities[0]);
    weatherService.fetchWeatherData.calls.reset();

    await component.loadCityWeather(component.cities[0]);
    expect(weatherService.fetchWeatherData).not.toHaveBeenCalled();
  });

  it('should update weather data when the date range changes', async () => {
    await component.loadCityWeather(component.cities[0]);

    component.dateRange = {
      start: new Date('2024-11-05'),
      end: new Date('2024-11-18'),
    };
    await component.loadCityWeather(component.cities[0]);

    const cityKey = component.cities[0].name;
    expect(weatherService.fetchWeatherData).toHaveBeenCalledWith({
      latitude: 52.52,
      longitude: 13.41,
      start_date: '2024-11-05',
      end_date: '2024-11-18',
      hourly: 'temperature_2m',
    });
  });
});
