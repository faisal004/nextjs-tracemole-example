export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      const { NodeSDK } = await import("@opentelemetry/sdk-node");
      const { OTLPTraceExporter } = await import(
        "@opentelemetry/exporter-trace-otlp-http"
      );
      const { getNodeAutoInstrumentations } = await import(
        "@opentelemetry/auto-instrumentations-node"
      );
      const { MongoDBInstrumentation } = await import(
        "@opentelemetry/instrumentation-mongodb"
      );
      const apiKey = process.env.TRACE_MOLE_API_KEY;
  
      const sdk = new NodeSDK({
        serviceName: process.env.OTEL_SERVICE_NAME ?? "my-next-app",
        traceExporter: new OTLPTraceExporter({
          url:
            process.env.TRACE_MOLE_EXPORTER_OTLP_TRACES_ENDPOINT ??
            "http://localhost:4318/v1/traces",
          headers: apiKey ? { "x-api-key": apiKey } : {},
        }),
  
        instrumentations: [
          getNodeAutoInstrumentations({
            // Disable default mongodb instrumentation bundled in auto-instrumentations
            "@opentelemetry/instrumentation-mongodb": { enabled: false },
          }),
          new MongoDBInstrumentation({ requireParentSpan: false }),
        ],
      });
  
      sdk.start();
    }
  }