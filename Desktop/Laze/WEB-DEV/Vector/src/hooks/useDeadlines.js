import { useState, useEffect, useCallback } from "react";
import { deadlinesAPI } from "../services/api";

export function useDeadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await deadlinesAPI.getAll();
      setDeadlines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  const createDeadline = useCallback(async (deadline) => {
    setError(null);

    try {
      const newDeadline = await deadlinesAPI.create(deadline);
      setDeadlines((prev) =>
        [...prev, newDeadline].sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
        ),
      );
      return newDeadline;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateDeadline = useCallback(async (id, deadline) => {
    setError(null);

    try {
      const updatedDeadline = await deadlinesAPI.update(id, deadline);
      setDeadlines((prev) =>
        prev.map((d) => (d.id === id ? updatedDeadline : d)),
      );
      return updatedDeadline;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleCompletion = useCallback(async (id) => {
    setError(null);

    try {
      const updatedDeadline = await deadlinesAPI.toggleCompletion(id);
      setDeadlines((prev) =>
        prev.map((d) => (d.id === id ? updatedDeadline : d)),
      );
      return updatedDeadline;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteDeadline = useCallback(async (id) => {
    setError(null);

    try {
      await deadlinesAPI.delete(id);
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    deadlines,
    loading,
    error,
    fetchDeadlines,
    createDeadline,
    updateDeadline,
    toggleCompletion,
    deleteDeadline,
  };
}

export function useUpcomingDeadlines(days = 7) {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpcoming = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await deadlinesAPI.getDueWithinDays(days);
      setDeadlines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  return { deadlines, loading, error, refetch: fetchUpcoming };
}

export function useDeadlineStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await deadlinesAPI.getStats();
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
