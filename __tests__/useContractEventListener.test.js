import { renderHook, act } from '@testing-library/react';
import useContractEventListener from '../utils/useContractEventListener';
import TronWeb from 'tronweb';

jest.mock('tronweb', () => ({
  contract: jest.fn(() => ({
    events: jest.fn(() => ({
      on: jest.fn((event, callback) => {
        if (event === 'data') callback({ message: 'test event data' });
        if (event === 'error') callback(new Error('test event error'));
      }),
    })),
  })),
}));

describe('useContractEventListener Hook', () => {
  it('should listen to contract events and return data', () => {
    const { result } = renderHook(() =>
      useContractEventListener('mockAddress', 'TestEvent')
    );

    act(() => {
      result.current.subscribe();
    });

    expect(result.current.eventData).toEqual({ message: 'test event data' });
  });

  it('should handle errors gracefully', () => {
    const { result } = renderHook(() =>
      useContractEventListener('mockAddress', 'TestEvent')
    );

    act(() => {
      result.current.subscribe();
    });

    expect(result.current.error).toEqual(new Error('test event error'));
  });
});
