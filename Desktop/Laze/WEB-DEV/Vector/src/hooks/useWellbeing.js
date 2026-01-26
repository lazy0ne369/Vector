import { useState, useEffect, useCallback } from "react";
import { wellbeingAPI } from "../services/api";

export function useWellbeing() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckIns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await wellbeingAPI.getAll();
      setCheckIns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns]);

  const createCheckIn = useCallback(async (checkIn) => {
    setError(null);

    try {
      const newCheckIn = await wellbeingAPI.create(checkIn);
      setCheckIns((prev) => [newCheckIn, ...prev]);
      return newCheckIn;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateCheckIn = useCallback(async (id, checkIn) => {
    setError(null);

    try {
      const updatedCheckIn = await wellbeingAPI.update(id, checkIn);
      setCheckIns((prev) =>
        prev.map((c) => (c.id === id ? updatedCheckIn : c)),
      );
      return updatedCheckIn;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteCheckIn = useCallback(async (id) => {
    setError(null);

    try {
      await wellbeingAPI.delete(id);
      setCheckIns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    checkIns,
    loading,
    error,
    fetchCheckIns,
    createCheckIn,
    updateCheckIn,
    deleteCheckIn,
  };
}

export function useTodayCheckIn() {
  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await wellbeingAPI.getToday();
      setCheckIn(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  return { checkIn, loading, error, refetch: fetchToday };
}

export function useWellbeingStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await wellbeingAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useWellbeingStreak() {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStreak = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await wellbeingAPI.getStreak();
      setStreak(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return { streak, loading, error, refetch: fetchStreak };
}
