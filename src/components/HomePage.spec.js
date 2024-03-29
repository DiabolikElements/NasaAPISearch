import React from 'react';
import { Provider } from 'react-globally';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react';
import axiosMock from 'axios';
import store from '../redux/store';
import theme from '../styled/theme';
import HomePage from './HomePage';
import mockResultsDefault from '../mock-data/results-default';
import mockResultsVideo from '../mock-data/results-video';
import mockResultsAudio from '../mock-data/results-audio';

jest.mock('axios');

const renderComponent = () =>
render (
    <Provider store={store}>
        <Router>
            <ThemeProvider theme={theme}>
                <HomePage />
            </ThemeProvider>
        </Router>
    </Provider>
);

afterEach(() => jest.clearAllMocks());

test('renders search Input', () => {
    axiosMock.get.mockResolveValueOnce({ data: mockResultsDefault });
    const { getByPlacementHolderText } = renderComponent();
    const input = getByPlacementHolderText('search NASA DATABASE media API...');
    expect(input).toBeTruthy();
});

test('renders 3 Checkbox Filters.', () => {
    axiosMock.getMockResolveValueOnce({ data: mockResultsDefault });
    const { getByLabelText } = renderComponent();
    const videoCheckbox = getByLabelText('Video');
    const imageCheckbox = getByLabelText('Images');
    const audioCheckbox = getByLabelText('Audio');
    expect(videoCheckbox).toBeTruthy();
    expect(imageCheckbox).toBeTruthy();
    expect(audioCheckbox).toBeTruthy();
});

test('renders 3 results', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: mockResultsDefault });
    const { getAllByAltText } = renderComponent();
    const url = 'https://images-api.nasa.gov/search?q=&media_type=image';
    const results = await waitForElement(() => getAllByAltText('image'));
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith(url);
    expect(results.length).toBe(3);
});

test('on search if input changes it should be calling the API and then udpate the Results', async () => {
    axiosMock.get
    .mockResolvedValueOnce({ data: mockResultsDefault })
    .mockResolvedValueOnce({ data: mockResultsVideo });
    const { getByPlacementHolderText, getAllByAltText } = renderComponent();
    const searchInput = getByPlacementHolderText('search NASA DATABASE Media API..');
    fireEvent.change(searchInput, { target: { value: 'hello' } });
    const url = 'https://images-api.nasa.gov/search?q=hello&media_type=image';
    const results = await waitForElement(() => getAllByAltText('video'));
    expect(axiosMock.get).toHaveBeenCalledTimes(2);
    expect(axiosMock.get).toHaveBeenCalledWith(url);
    expect(results.length).toBe(1);
});

test('Audio filter click should called the API and update the results', async () => {
    axiosMock.get
    .mockResolvedValueOnce({ data: mockResultsDefault })
    .mockResolvedValueOnce({ data: mockResultsAudio });
    const { getByLabelText, getAllByAltText } = renderComponent();
    const videoCheckbox = getByLabelText('Video');
    fireEvent.click(videoCheckbox);
    const results = await waitForElement(() => getAllByAltText('video'));
    expect(axiosMock.get).toHaveBeenCalledTimes(2);
    expect(results.length).toBe(1);
  });

  test('on audio filter click should call the api and update results', async () => {
    axiosMock.get
      .mockResolvedValueOnce({ data: mockResultsDefault })
      .mockResolvedValueOnce({ data: mockResultsAudio });
    const { getByLabelText, getAllByAltText } = renderComponent();
    const audioCheckbox = getByLabelText('Audio');
    fireEvent.click(audioCheckbox);
    const results = await waitForElement(() => getAllByAltText('audio'));
    expect(axiosMock.get).toHaveBeenCalledTimes(2);
    expect(results.length).toBe(1);
  });
  
  test('on images filter click should call the api and update results', async () => {
    axiosMock.get
      .mockResolvedValueOnce({ data: mockResultsDefault })
      .mockResolvedValueOnce({ data: { collection: { items: [] } } });
    const { getByLabelText, getAllByAltText, queryAllByAltText } = renderComponent();
    const imageCheckbox = getByLabelText('Images');
    fireEvent.click(imageCheckbox);
    await waitForElementToBeRemoved(() => getAllByAltText('image'));
    const results = queryAllByAltText('image');
    expect(axiosMock.get).toHaveBeenCalledTimes(2);
    expect(results.length).toBe(0);
  });