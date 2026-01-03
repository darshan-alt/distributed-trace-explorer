'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockTraces } from '@/lib/mock-data';
import { Search, Filter, ArrowUpDown, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function TraceListPage() {
    const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'OK'>('ALL');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'duration' | 'time'>('time');

    const filteredTraces = useMemo(() => {
        return mockTraces
            .filter(t => {
                if (filter === 'ALL') return true;
                return t.status === filter;
            })
            .filter(t =>
                t.trace_id.toLowerCase().includes(search.toLowerCase()) ||
                t.root_service.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'duration') return b.total_duration_ms - a.total_duration_ms;
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
    }, [filter, search, sortBy]);

    return (
        <div className="page-container container">
            <header className="page-header">
                <div className="header-titles">
                    <h1>Traces</h1>
                    <p>Real-time distributed request flow</p>
                </div>

                <div className="header-controls">
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search traces..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <button
                            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'ERROR' ? 'active' : ''}`}
                            onClick={() => setFilter('ERROR')}
                        >
                            Errors
                        </button>
                    </div>

                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="time">Latest First</option>
                        <option value="duration">Longest Duration</option>
                    </select>
                </div>
            </header>

            <div className="card table-container">
                <table className="trace-table">
                    <thead>
                        <tr>
                            <th>Trace ID</th>
                            <th>Root Service</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTraces.length > 0 ? (
                            filteredTraces.map((trace) => (
                                <tr key={trace.trace_id}>
                                    <td className="trace-id">
                                        <code>{trace.trace_id}</code>
                                    </td>
                                    <td>
                                        <span className="service-tag">{trace.root_service}</span>
                                    </td>
                                    <td>
                                        <div className={`status-badge ${trace.status.toLowerCase()}`}>
                                            {trace.status === 'ERROR' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                                            {trace.status}
                                        </div>
                                    </td>
                                    <td className="duration-cell">
                                        {trace.total_duration_ms}ms
                                    </td>
                                    <td className="time-cell">
                                        {formatDistanceToNow(new Date(trace.timestamp), { addSuffix: true })}
                                    </td>
                                    <td className="actions-cell">
                                        <Link href={`/traces/${trace.trace_id}`} className="view-btn">
                                            View <ChevronRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="empty-state">
                                    <div className="empty-content">
                                        <Search size={40} />
                                        <h3>No traces found</h3>
                                        <p>Try adjusting your search or filters.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .page-container {
          padding-top: 3rem;
          padding-bottom: 5rem;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .header-titles h1 {
          font-size: 2.25rem;
          margin-bottom: 0.25rem;
        }
        .header-titles p {
          color: var(--secondary);
          font-size: 1rem;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-bar {
          background: var(--tertiary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          padding: 0 0.875rem;
          gap: 0.5rem;
          width: 300px;
          height: 40px;
          transition: var(--transition);
        }
        .search-bar:focus-within {
          border-color: var(--accent);
          background: white;
          box-shadow: 0 0 0 4px rgba(0, 118, 255, 0.1);
        }
        .search-bar input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          font-size: 0.9375rem;
          color: var(--foreground);
        }

        .filter-group {
          display: flex;
          background: var(--tertiary);
          padding: 3px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .filter-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--secondary);
          transition: var(--transition);
        }
        .filter-btn.active {
          background: white;
          color: var(--foreground);
          box-shadow: var(--shadow-sm);
        }

        .sort-select {
          height: 40px;
          padding: 0 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--tertiary);
          color: var(--secondary);
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
        }

        .table-container {
          width: 100%;
          overflow: hidden;
        }
        .trace-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .trace-table th {
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--secondary);
          border-bottom: 1px solid var(--border);
          background: var(--tertiary);
          font-weight: 600;
        }
        .trace-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
          vertical-align: middle;
        }
        .trace-table tr:last-child td {
          border-bottom: none;
        }
        .trace-table tr:hover td {
          background: rgba(0,0,0,0.01);
        }

        .trace-id code {
          background: var(--tertiary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: var(--secondary);
          font-size: 0.8125rem;
        }
        .service-tag {
          font-weight: 500;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge.ok {
          background: rgba(52, 199, 89, 0.1);
          color: var(--success);
        }
        .status-badge.error {
          background: rgba(255, 59, 48, 0.1);
          color: var(--error);
        }

        .duration-cell {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }
        .time-cell {
          color: var(--secondary);
        }
        
        .view-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--accent);
          font-weight: 500;
          font-size: 0.875rem;
          transition: var(--transition);
        }
        .view-btn:hover {
          gap: 0.5rem;
        }

        .empty-state {
          padding: 6rem 0;
          text-align: center;
        }
        .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--secondary);
        }
        .empty-content h3 {
          color: var(--foreground);
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .header-controls { width: 100%; }
          .search-bar { width: 100%; }
          .time-cell, .duration-cell { display: none; }
        }
      `}} />
        </div>
    );
}
