// Tests for todayStore state logic
import { act } from 'react';
import { useTodayStore } from '../src/stores/todayStore';

// Reset store before each test
beforeEach(() => {
  act(() => useTodayStore.getState().reset());
});

describe('todayStore — addSteps', () => {
  it('starts at 0 steps', () => {
    expect(useTodayStore.getState().steps).toBe(0);
  });

  it('adds steps correctly', () => {
    act(() => useTodayStore.getState().addSteps(500));
    expect(useTodayStore.getState().steps).toBe(500);
    act(() => useTodayStore.getState().addSteps(300));
    expect(useTodayStore.getState().steps).toBe(800);
  });

  it('calculates distance from steps', () => {
    act(() => useTodayStore.getState().addSteps(1000));
    // 1000 steps × 0.75m = 750m
    expect(useTodayStore.getState().distanceM).toBe(750);
  });

  it('calculates calories from steps', () => {
    act(() => useTodayStore.getState().addSteps(10000));
    expect(useTodayStore.getState().calories).toBe(400);
  });

  it('sets goalMet when steps reach goal', () => {
    act(() => useTodayStore.getState().setGoal(1000));
    act(() => useTodayStore.getState().addSteps(999));
    expect(useTodayStore.getState().goalMet).toBe(false);
    act(() => useTodayStore.getState().addSteps(1));
    expect(useTodayStore.getState().goalMet).toBe(true);
  });
});

describe('todayStore — setGoal', () => {
  it('updates goal and recalculates percent', () => {
    act(() => useTodayStore.getState().setSteps(5000));
    act(() => useTodayStore.getState().setGoal(10000));
    expect(useTodayStore.getState().percent).toBe(50);
  });

  it('caps percent at 100 when over goal', () => {
    act(() => useTodayStore.getState().setSteps(15000));
    act(() => useTodayStore.getState().setGoal(10000));
    expect(useTodayStore.getState().percent).toBe(100);
  });
});

describe('todayStore — reset', () => {
  it('resets all values to zero', () => {
    act(() => {
      useTodayStore.getState().addSteps(5000);
      useTodayStore.getState().reset();
    });
    const s = useTodayStore.getState();
    expect(s.steps).toBe(0);
    expect(s.distanceM).toBe(0);
    expect(s.calories).toBe(0);
    expect(s.percent).toBe(0);
    expect(s.goalMet).toBe(false);
  });
});

describe('todayStore — markCelebrationFired', () => {
  it('marks celebration as fired', () => {
    expect(useTodayStore.getState().celebrationFired).toBe(false);
    act(() => useTodayStore.getState().markCelebrationFired());
    expect(useTodayStore.getState().celebrationFired).toBe(true);
  });
});
