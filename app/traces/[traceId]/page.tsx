'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockTraces, Trace, Span } from '@/lib/mock-data';
import {
    ChevronLeft,
    Info,
    List,
    Clock,
    Activity,
    Database,
    ShieldCheck,
    AlertTriangle,
    X,
    Copy
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function TraceDetailPage() {
    const { traceId } = useParams();
    const router = useRouter();
    const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);
    const [hoveredSpanId, setHoveredSpanId] = useState<string | null>(null);

    const trace = useMemo(() => {
        return mockTraces.find(t => t.trace_id === traceId);
    }, [traceId]);

    if (!trace) {
        return (
            <div className="container error-container">
                <AlertTriangle size={48} color="var(--error)" />
                <h2>Trace Not Found</h2>
                <p>The trace with ID {traceId} does not exist or has been deleted.</p>
                <button onClick={() => router.push('/traces')} className="back-btn">
                    <ChevronLeft size={18} /> Back to Traces
                </button>
            </div>
        );
    }

    const selectedSpan = useMemo(() => {
        return trace.spans.find(s => s.span_id === selectedSpanId);
    }, [trace, selectedSpanId]);

    // Recursively build the tree for indentation
    const spanTree = useMemo(() => {
        const buildTree = (parentId: string | null, depth = 0): (Span & { depth: number })[] => {
            const children = trace.spans.filter(s => s.parent_id === parentId);
            let result: (Span & { depth: number })[] = [];

            children.forEach(child => {
                result.push({ ...child, depth });
                result = [...result, ...buildTree(child.span_id, depth + 1)];
            });

            return result;
        };

        return buildTree(null);
    }, [trace]);

    // Get all ancestor IDs for a given span
    const getAncestors = (spanId: string | null): string[] => {
        if (!spanId) return [];
        const span = trace.spans.find(s => s.span_id === spanId);
        if (!span || !span.parent_id) return [];
        return [span.parent_id, ...getAncestors(span.parent_id)];
    };

    const hoveredPathIds = useMemo(() => {
        if (!hoveredSpanId) return [];
        return [hoveredSpanId, ...getAncestors(hoveredSpanId)];
    }, [hoveredSpanId, trace]);

    return (
        <div className="trace-detail-layout">
            {/* Left / Top Header */}
            <div className="trace-header glass">
                <div className="container header-inner">
                    <button onClick={() => router.push('/traces')} className="back-nav">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="trace-meta">
                        <div className="title-row">
                            <h1>Trace: {trace.trace_id}</h1>
                            <div className={`status-pill ${trace.status.toLowerCase()}`}>
                                {trace.status}
                            </div>
                        </div>
                        <div className="stats-row">
                            <div className="stat">
                                <Clock size={14} />
                                <span>{trace.total_duration_ms}ms</span>
                            </div>
                            <div className="stat">
                                <Activity size={14} />
                                <span>{trace.spans.length} Spans</span>
                            </div>
                            <div className="stat">
                                <Database size={14} />
                                <span>{trace.root_service}</span>
                            </div>
                            <div className="stat">
                                <span>{formatDistanceToNow(new Date(trace.timestamp), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content container">
                <div className="waterfall-section">
                    <div className="waterfall-header">
                        <div className="col-service">Service & Operation</div>
                        <div className="col-timeline">Timeline ({trace.total_duration_ms}ms)</div>
                    </div>
                    <div className="waterfall-body">
                        {spanTree.map((span) => {
                            const startPercent = (span.start_ms / trace.total_duration_ms) * 100;
                            const widthPercent = (span.duration_ms / trace.total_duration_ms) * 100;
                            const isHighlighted = hoveredPathIds.includes(span.span_id);

                            return (
                                <div
                                    key={span.span_id}
                                    className={`span-row ${selectedSpanId === span.span_id ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                                    onClick={() => setSelectedSpanId(span.span_id)}
                                    onMouseEnter={() => setHoveredSpanId(span.span_id)}
                                    onMouseLeave={() => setHoveredSpanId(null)}
                                >
                                    <div className="col-service" style={{ paddingLeft: `${span.depth * 20 + 16}px` }}>
                                        <div className="service-info">
                                            <span className="service-name">{span.service}</span>
                                            <span className="op-name">{span.operation}</span>
                                        </div>
                                    </div>
                                    <div className="col-timeline">
                                        <div className="timeline-container">
                                            <motion.div
                                                className={`span-bar ${span.status === 'ERROR' ? 'error' : ''}`}
                                                initial={false}
                                                animate={{
                                                    width: `${Math.max(widthPercent, 0.5)}%`,
                                                    scaleY: isHighlighted ? 1.4 : 1
                                                }}
                                                transition={{ duration: 0.15 }}
                                                style={{
                                                    marginLeft: `${startPercent}%`,
                                                }}
                                            >
                                                <div className="span-tooltip">{span.duration_ms}ms</div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details Panel */}
                <AnimatePresence>
                    {selectedSpan && (
                        <motion.div
                            className="details-panel"
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="panel-header">
                                <h3>Span Details</h3>
                                <button onClick={() => setSelectedSpanId(null)} className="close-btn">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="panel-body">
                                <div className="detail-group">
                                    <label>Operation</label>
                                    <div className="value large">{selectedSpan.operation}</div>
                                </div>
                                <div className="detail-group">
                                    <label>Service</label>
                                    <div className="value service-tag">{selectedSpan.service}</div>
                                </div>
                                <div className="detail-grid">
                                    <div className="detail-group">
                                        <label>Start Time</label>
                                        <div className="value">+{selectedSpan.start_ms}ms</div>
                                    </div>
                                    <div className="detail-group">
                                        <label>Duration</label>
                                        <div className="value">{selectedSpan.duration_ms}ms</div>
                                    </div>
                                    <div className="detail-group">
                                        <label>Status</label>
                                        <div className={`value status-${selectedSpan.status.toLowerCase()}`}>
                                            {selectedSpan.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="attributes-section">
                                    <div className="section-title">
                                        <List size={14} />
                                        <span>Attributes</span>
                                    </div>
                                    <div className="attributes-list">
                                        {Object.entries(selectedSpan.attributes).map(([key, val]) => (
                                            <div key={key} className="attr-item">
                                                <span className="attr-key">{key}</span>
                                                <span className="attr-val">{val.toString()}</span>
                                            </div>
                                        ))}
                                        {Object.keys(selectedSpan.attributes).length === 0 && (
                                            <div className="empty-attr">No attributes found</div>
                                        )}
                                    </div>
                                </div>

                                <div className="id-section">
                                    <div className="id-item">
                                        <label>Span ID</label>
                                        <code>{selectedSpan.span_id}</code>
                                    </div>
                                    <div className="id-item">
                                        <label>Parent ID</label>
                                        <code>{selectedSpan.parent_id || 'root'}</code>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .trace-detail-layout {
           min-height: 100vh;
           display: flex;
           flex-direction: column;
        }
        .trace-header {
           padding: 1.5rem 0;
           z-index: 50;
        }
        .header-inner {
           display: flex;
           gap: 1.5rem;
           align-items: flex-start;
        }
        .back-nav {
           width: 40px;
           height: 40px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           border: 1px solid var(--border);
           transition: var(--transition);
        }
        .back-nav:hover {
           background: var(--tertiary);
        }
        .trace-meta h1 {
           font-size: 1.5rem;
           margin-bottom: 0.5rem;
        }
        .title-row {
           display: flex;
           align-items: center;
           gap: 1rem;
        }
        .status-pill {
           padding: 0.25rem 0.75rem;
           border-radius: 100px;
           font-size: 0.75rem;
           font-weight: 700;
           text-transform: uppercase;
        }
        .status-pill.ok { background: rgba(52, 199, 89, 0.1); color: var(--success); }
        .status-pill.error { background: rgba(255, 59, 48, 0.1); color: var(--error); }

        .stats-row {
           display: flex;
           gap: 1.5rem;
           color: var(--secondary);
           font-size: 0.875rem;
        }
        .stat {
           display: flex;
           align-items: center;
           gap: 0.375rem;
        }

        .main-content {
           flex: 1;
           display: flex;
           padding-top: 2rem;
           padding-bottom: 4rem;
           gap: 2rem;
           position: relative;
        }

        .waterfall-section {
           flex: 1;
           background: var(--background);
           border: 1px solid var(--border);
           border-radius: var(--radius-lg);
           overflow: hidden;
           height: fit-content;
        }
        .waterfall-header {
           display: flex;
           background: var(--tertiary);
           border-bottom: 1px solid var(--border);
           font-size: 0.75rem;
           font-weight: 600;
           color: var(--secondary);
           text-transform: uppercase;
        }
        .col-service {
           width: 350px;
           padding: 0.75rem 1rem;
           border-right: 1px solid var(--border);
        }
        .col-timeline {
           flex: 1;
           padding: 0.75rem 1rem;
        }

        .span-row {
           display: flex;
           border-bottom: 1px solid #f0f0f0;
           cursor: pointer;
           transition: background 0.1s;
        }
        .span-row:hover {
           background: #fbfbfb;
        }
        .span-row.highlighted {
           background: rgba(0, 118, 255, 0.03);
        }
        .span-row.selected {
           background: rgba(0, 118, 255, 0.06);
        }
        .service-info {
           display: flex;
           flex-direction: column;
           gap: 0.125rem;
        }
        .service-name {
           font-size: 0.8125rem;
           font-weight: 600;
           color: var(--foreground);
        }
        .op-name {
           font-size: 0.75rem;
           color: var(--secondary);
        }

        .timeline-container {
           height: 100%;
           display: flex;
           align-items: center;
           position: relative;
        }
        .span-bar {
           height: 8px;
           background: var(--accent);
           border-radius: 4px;
           min-width: 4px;
           position: relative;
        }
        .span-bar.error {
           background: var(--error);
        }
        .span-tooltip {
           position: absolute;
           top: -24px;
           left: 50%;
           transform: translateX(-50%);
           background: var(--foreground);
           color: white;
           font-size: 0.625rem;
           padding: 2px 6px;
           border-radius: 4px;
           opacity: 0;
           transition: opacity 0.2s;
           pointer-events: none;
           white-space: nowrap;
        }
        .span-row:hover .span-tooltip {
           opacity: 1;
        }

        .details-panel {
           width: 400px;
           background: white;
           border: 1px solid var(--border);
           border-radius: var(--radius-lg);
           box-shadow: var(--shadow-lg);
           height: calc(100vh - 150px);
           position: sticky;
           top: 80px;
           display: flex;
           flex-direction: column;
           overflow: hidden;
        }
        .panel-header {
           padding: 1.5rem;
           border-bottom: 1px solid var(--border);
           display: flex;
           justify-content: space-between;
           align-items: center;
        }
        .panel-body {
           padding: 1.5rem;
           overflow-y: auto;
           display: flex;
           flex-direction: column;
           gap: 1.5rem;
        }
        .detail-group label {
           font-size: 0.75rem;
           font-weight: 600;
           color: var(--secondary);
           text-transform: uppercase;
           display: block;
           margin-bottom: 0.5rem;
        }
        .value {
           font-size: 0.9375rem;
           font-weight: 500;
        }
        .value.large {
           font-size: 1.125rem;
           font-weight: 600;
        }
        .detail-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 1.5rem;
        }
        .status-ok { color: var(--success); }
        .status-error { color: var(--error); }

        .attributes-section {
           border-top: 1px solid var(--border);
           padding-top: 1.5rem;
        }
        .section-title {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           font-size: 0.75rem;
           font-weight: 600;
           color: var(--secondary);
           text-transform: uppercase;
           margin-bottom: 1rem;
        }
        .attributes-list {
           display: flex;
           flex-direction: column;
           gap: 0.5rem;
        }
        .attr-item {
           display: flex;
           flex-direction: column;
           padding: 0.75rem;
           background: var(--tertiary);
           border-radius: var(--radius-md);
           gap: 0.25rem;
        }
        .attr-key {
           font-size: 0.75rem;
           font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
           color: var(--secondary);
        }
        .attr-val {
           font-size: 0.8125rem;
           font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
           word-break: break-all;
        }

        .id-section {
           border-top: 1px solid var(--border);
           padding-top: 1.5rem;
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }
        .id-item label {
           font-size: 0.75rem;
           color: var(--secondary);
           margin-bottom: 0.25rem;
        }
        .id-item code {
           display: block;
           background: var(--tertiary);
           padding: 0.5rem;
           border-radius: 4px;
           font-size: 0.8125rem;
        }

        @media (max-width: 1100px) {
           .main-content { flex-direction: column; }
           .details-panel { width: 100%; position: static; height: auto; }
           .col-service { width: 200px; }
        }
      `}} />
        </div>
    );
}
