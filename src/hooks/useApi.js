'use client';
import { useCallback } from 'react';

export function useApi() {
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, []);

  const get = useCallback(async (url) => {
    const res = await fetch(`/api${url}`, { headers: getHeaders() });
    return res.json();
  }, [getHeaders]);

  const post = useCallback(async (url, body) => {
    const res = await fetch(`/api${url}`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    });
    return res.json();
  }, [getHeaders]);

  const put = useCallback(async (url, body) => {
    const res = await fetch(`/api${url}`, {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(body)
    });
    return res.json();
  }, [getHeaders]);

  const del = useCallback(async (url) => {
    const res = await fetch(`/api${url}`, { method: 'DELETE', headers: getHeaders() });
    return res.json();
  }, [getHeaders]);

  return { get, post, put, del };
}
