export type SpanStatus = 'OK' | 'ERROR';

export interface Span {
    span_id: string;
    parent_id: string | null;
    service: string;
    operation: string;
    start_ms: number;
    duration_ms: number;
    status: SpanStatus;
    attributes: Record<string, string | number | boolean>;
}

export interface Trace {
    trace_id: string;
    root_service: string;
    total_duration_ms: number;
    status: SpanStatus;
    timestamp: string;
    spans: Span[];
}

const services = ['api-gateway', 'auth-service', 'user-service', 'order-service', 'payment-service', 'inventory-service', 'email-worker'];

function generateTraceID() {
    return Math.random().toString(16).substring(2, 10);
}

function generateSpanID() {
    return Math.random().toString(16).substring(2, 8);
}

export const mockTraces: Trace[] = [
    {
        trace_id: "tr-92a1b3",
        root_service: "api-gateway",
        total_duration_ms: 450,
        status: "ERROR",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        spans: [
            {
                span_id: "sp-1",
                parent_id: null,
                service: "api-gateway",
                operation: "POST /v1/checkout",
                start_ms: 0,
                duration_ms: 450,
                status: "ERROR",
                attributes: { "http.method": "POST", "http.route": "/v1/checkout" }
            },
            {
                span_id: "sp-2",
                parent_id: "sp-1",
                service: "auth-service",
                operation: "Authorize",
                start_ms: 10,
                duration_ms: 45,
                status: "OK",
                attributes: { "user.id": "usr_992" }
            },
            {
                span_id: "sp-3",
                parent_id: "sp-1",
                service: "order-service",
                operation: "CreatePendingOrder",
                start_ms: 65,
                duration_ms: 120,
                status: "OK",
                attributes: {}
            },
            {
                span_id: "sp-4",
                parent_id: "sp-3",
                service: "inventory-service",
                operation: "ReserveStock",
                start_ms: 80,
                duration_ms: 85,
                status: "OK",
                attributes: { "item.id": "sku-102", "quantity": 1 }
            },
            {
                span_id: "sp-5",
                parent_id: "sp-1",
                service: "payment-service",
                operation: "ProcessPayment",
                start_ms: 200,
                duration_ms: 250,
                status: "ERROR",
                attributes: { "stripe.error": "insufficient_funds", "card.last4": "4242" }
            }
        ]
    },
    {
        trace_id: "tr-3e8f12",
        root_service: "api-gateway",
        total_duration_ms: 125,
        status: "OK",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        spans: [
            {
                span_id: "sp-a1",
                parent_id: null,
                service: "api-gateway",
                operation: "GET /v1/profile",
                start_ms: 0,
                duration_ms: 125,
                status: "OK",
                attributes: { "http.method": "GET" }
            },
            {
                span_id: "sp-a2",
                parent_id: "sp-a1",
                service: "user-service",
                operation: "GetUserProfile",
                start_ms: 15,
                duration_ms: 100,
                status: "OK",
                attributes: { "user.id": "usr_782" }
            }
        ]
    },
    {
        trace_id: "tr-b5c90d",
        root_service: "api-gateway",
        total_duration_ms: 1240,
        status: "OK",
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        spans: [
            {
                span_id: "sp-b1",
                parent_id: null,
                service: "api-gateway",
                operation: "GET /v1/search",
                start_ms: 0,
                duration_ms: 1240,
                status: "OK",
                attributes: { "q": "laptop" }
            },
            {
                span_id: "sp-b2",
                parent_id: "sp-b1",
                service: "inventory-service",
                operation: "ElasticSearchQuery",
                start_ms: 50,
                duration_ms: 1150,
                status: "OK",
                attributes: { "db.system": "elasticsearch", "db.query": "match 'laptop'" }
            }
        ]
    },
    {
        trace_id: "tr-f7a3b4",
        root_service: "api-gateway",
        total_duration_ms: 320,
        status: "OK",
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        spans: [
            {
                span_id: "sp-c1",
                parent_id: null,
                service: "api-gateway",
                operation: "POST /v1/orders",
                start_ms: 0,
                duration_ms: 320,
                status: "OK",
                attributes: {}
            },
            {
                span_id: "sp-c2",
                parent_id: "sp-c1",
                service: "order-service",
                operation: "ProcessOrder",
                start_ms: 20,
                duration_ms: 280,
                status: "OK",
                attributes: {}
            },
            {
                span_id: "sp-c3",
                parent_id: "sp-c2",
                service: "email-worker",
                operation: "SendConfirmation",
                start_ms: 250,
                duration_ms: 40,
                status: "OK",
                attributes: { "email.provider": "sendgrid" }
            }
        ]
    }
];
