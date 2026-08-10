# Google Analytics 4 Plugin - Usage Examples

## Initialization

```typescript
import { googleanalytics4 } from '@corsairdev/googleanalytics4';

// Initialize with OAuth 2.0 (default)
const ga4Plugin = googleanalytics4({
  authType: 'oauth_2',
});

// With restricted permissions
const restrictedGA4 = googleanalytics4({
  permissions: {
    'properties.create': false,
    'properties.update': false,
    'customDimensions.create': false,
    'customMetrics.create': false,
    'measurementProtocol.sendEvent': false,
  },
});
```

## Admin API Examples

### Accounts

```typescript
// List all accessible accounts
const accounts = await corsair.call(
  'googleanalytics4',
  'accounts.list',
  {
    pageSize: 50,
  }
);

// Get specific account details
const account = await corsair.call(
  'googleanalytics4',
  'accounts.get',
  {
    name: 'accounts/123456789',
  }
);
```

### Properties

```typescript
// List properties in an account
const properties = await corsair.call(
  'googleanalytics4',
  'properties.list',
  {
    filter: 'parent:accounts/123456789',
    pageSize: 100,
  }
);

// Create a new property
const newProperty = await corsair.call(
  'googleanalytics4',
  'properties.create',
  {
    displayName: 'My Website',
    parentAccount: 'accounts/123456789',
    timeZone: 'America/New_York',
    currencyCode: 'USD',
  }
);

// Update property timezone
const updatedProperty = await corsair.call(
  'googleanalytics4',
  'properties.update',
  {
    name: 'properties/987654321',
    timeZone: 'Europe/London',
    updateMask: 'timeZone',
  }
);
```

### Custom Dimensions

```typescript
// List existing custom dimensions
const dimensions = await corsair.call(
  'googleanalytics4',
  'customDimensions.list',
  {
    parent: 'properties/987654321',
    pageSize: 50,
  }
);

// Create a new custom dimension
const customDim = await corsair.call(
  'googleanalytics4',
  'customDimensions.create',
  {
    parent: 'properties/987654321',
    customDimension: {
      parameterName: 'subscription_tier',
      displayName: 'Subscription Tier',
      description: 'User subscription level (free, pro, enterprise)',
      scope: 'USER',
    },
  }
);
```

### Custom Metrics

```typescript
// Create a custom metric for purchase value
const customMetric = await corsair.call(
  'googleanalytics4',
  'customMetrics.create',
  {
    parent: 'properties/987654321',
    customMetric: {
      parameterName: 'purchase_value_usd',
      displayName: 'Purchase Value (USD)',
      description: 'Total value of purchases in USD',
      measurementUnit: 'CURRENCY',
      scope: 'EVENT',
    },
  }
);
```

### Data Streams

```typescript
// List all data streams for a property
const streams = await corsair.call(
  'googleanalytics4',
  'dataStreams.list',
  {
    parent: 'properties/987654321',
  }
);

// Get specific data stream details (includes measurement ID)
const webStream = await corsair.call(
  'googleanalytics4',
  'dataStreams.get',
  {
    name: 'properties/987654321/dataStreams/123456789',
  }
);
```

### Audiences

```typescript
// List existing audiences
const audiences = await corsair.call(
  'googleanalytics4',
  'audiences.list',
  {
    parent: 'properties/987654321',
  }
);

// Create an audience for high-value users
const audience = await corsair.call(
  'googleanalytics4',
  'audiences.create',
  {
    parent: 'properties/987654321',
    audience: {
      displayName: 'High Value Customers',
      description: 'Users with lifetime value > $1000',
      membershipDurationDays: 30,
      filterClauses: [
        {
          clauseType: 'ANDed',
          simpleOperand: {
            scope: 'USER',
            filterExpression: 'user_lifetime_value > 1000',
          },
        },
      ],
    },
  }
);
```

## Data API Examples

### Standard Reports

```typescript
// Run a simple report: sessions by country
const report = await corsair.call(
  'googleanalytics4',
  'reporting.runReport',
  {
    property: 'properties/987654321',
    dateRanges: [
      {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        name: 'January 2024',
      },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    dimensions: [
      { name: 'country' },
    ],
    limit: 250,
  }
);

// Report with filtering and sorting
const advancedReport = await corsair.call(
  'googleanalytics4',
  'reporting.runReport',
  {
    property: 'properties/987654321',
    dateRanges: [
      {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'bounceRate' },
      { name: 'avgSessionDuration' },
    ],
    dimensions: [
      { name: 'pagePath' },
      { name: 'deviceCategory' },
    ],
    filters: [
      {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'BEGINS_WITH',
          value: '/products',
          caseSensitive: false,
        },
      },
    ],
    orderBys: [
      {
        metric: { metricName: 'sessions' },
        desc: true,
      },
    ],
    limit: 100,
  }
);

// Report comparing multiple date ranges
const comparisonReport = await corsair.call(
  'googleanalytics4',
  'reporting.runReport',
  {
    property: 'properties/987654321',
    dateRanges: [
      {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        name: 'This Month',
      },
      {
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        name: 'Last Month',
      },
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'totalRevenue' },
    ],
    dimensions: [
      { name: 'dateHour' },
    ],
  }
);
```

### Realtime Reports

```typescript
// Get current active users
const realtimeReport = await corsair.call(
  'googleanalytics4',
  'reporting.runRealtimeReport',
  {
    property: 'properties/987654321',
    metrics: [
      { name: 'activeUsers' },
      { name: 'eventCount' },
    ],
    minuteRanges: [
      {
        startMinutesAgo: 30,  // Last 30 minutes
        endMinutesAgo: 0,     // Until now
      },
    ],
  }
);

// Realtime by country (last 5 minutes)
const realtimeByCountry = await corsair.call(
  'googleanalytics4',
  'reporting.runRealtimeReport',
  {
    property: 'properties/987654321',
    metrics: [
      { name: 'activeUsers' },
    ],
    dimensions: [
      { name: 'country' },
      { name: 'city' },
    ],
    minuteRanges: [
      {
        startMinutesAgo: 5,
        endMinutesAgo: 0,
      },
    ],
    orderBys: [
      {
        metric: { metricName: 'activeUsers' },
        desc: true,
      },
    ],
    limit: 10,
  }
);
```

## Measurement Protocol Examples

### Sending Events

```typescript
// Send a single purchase event
const result = await corsair.call(
  'googleanalytics4',
  'measurementProtocol.sendEvent',
  {
    measurementId: 'G-XXXXXXXXXX',
    apiSecret: 'your_api_secret_here',
    clientId: 'user123',
    userId: 'user@example.com',
    events: [
      {
        name: 'purchase',
        params: {
          value: 99.99,
          currency: 'USD',
          items: [
            {
              item_id: 'SKU_12345',
              item_name: 'Premium Widget',
              quantity: 1,
              price: 99.99,
            },
          ],
          transaction_id: 'txn_12345',
        },
      },
    ],
    userProperties: {
      user_tier: 'gold',
      lifetime_value: '5000.00',
    },
  }
);

// Send batch events
const batchEvents = await corsair.call(
  'googleanalytics4',
  'measurementProtocol.sendEvent',
  {
    measurementId: 'G-XXXXXXXXXX',
    apiSecret: 'your_api_secret_here',
    clientId: 'user456',
    events: [
      {
        name: 'page_view',
        params: {
          page_title: 'Product Page',
          page_location: 'https://example.com/products/123',
        },
      },
      {
        name: 'scroll',
        params: {
          scroll_depth: 50,
        },
      },
      {
        name: 'click',
        params: {
          button_name: 'Add to Cart',
        },
      },
    ],
  }
);

// Send with custom timestamp (backend-dated event)
const pastEvent = await corsair.call(
  'googleanalytics4',
  'measurementProtocol.sendEvent',
  {
    measurementId: 'G-XXXXXXXXXX',
    apiSecret: 'your_api_secret_here',
    clientId: 'user789',
    timestamp: Date.parse('2024-01-15T14:30:00Z'),
    events: [
      {
        name: 'imported_event',
        params: {
          source: 'legacy_system',
          amount: 150.00,
        },
      },
    ],
  }
);
```

### Validating Events

```typescript
// Validate event payload without sending
const validation = await corsair.call(
  'googleanalytics4',
  'measurementProtocol.validate',
  {
    measurementId: 'G-XXXXXXXXXX',
    apiSecret: 'your_api_secret_here',
    clientId: 'test_user',
    events: [
      {
        name: 'purchase',
        params: {
          value: 'invalid_value',  // Should be number
          currency: 'USD',
          items: [],
        },
      },
    ],
  }
);
// Response includes validation_messages array with issues
```

## Agent Workflow Examples

### Example 1: Set Up Product Tracking

```typescript
// Agent command: "Set up tracking for our e-commerce platform"

// Step 1: Check existing properties
const properties = await corsair.call('googleanalytics4', 'properties.list', {
  filter: 'parent:accounts/123456789',
});

// Step 2: Create custom dimension for product category
await corsair.call('googleanalytics4', 'customDimensions.create', {
  parent: 'properties/987654321',
  customDimension: {
    parameterName: 'product_category',
    displayName: 'Product Category',
    scope: 'EVENT',
  },
});

// Step 3: Create custom metric for cart value
await corsair.call('googleanalytics4', 'customMetrics.create', {
  parent: 'properties/987654321',
  customMetric: {
    parameterName: 'cart_value',
    displayName: 'Shopping Cart Value',
    measurementUnit: 'CURRENCY',
    scope: 'EVENT',
  },
});

// Step 4: Create audience for cart abandoners
await corsair.call('googleanalytics4', 'audiences.create', {
  parent: 'properties/987654321',
  audience: {
    displayName: 'Cart Abandoners',
    filterClauses: [
      {
        clauseType: 'ANDed',
        simpleOperand: {
          scope: 'USER',
          filterExpression: 'has_abandoned_cart = true',
        },
      },
    ],
  },
});
```

### Example 2: Analytics Dashboard Query

```typescript
// Agent command: "Show me top-performing pages this month"

const report = await corsair.call('googleanalytics4', 'reporting.runReport', {
  property: 'properties/987654321',
  dateRanges: [
    {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
  ],
  metrics: [
    { name: 'screenPageViews' },
    { name: 'activeUsers' },
    { name: 'engagementRate' },
  ],
  dimensions: [
    { name: 'pagePath' },
  ],
  orderBys: [
    {
      metric: { metricName: 'screenPageViews' },
      desc: true,
    },
  ],
  limit: 10,
});
```

### Example 3: Real-time Monitoring

```typescript
// Agent command: "How many users are on the site right now?"

const realtime = await corsair.call(
  'googleanalytics4',
  'reporting.runRealtimeReport',
  {
    property: 'properties/987654321',
    metrics: [
      { name: 'activeUsers' },
    ],
    minuteRanges: [
      {
        startMinutesAgo: 0,
        endMinutesAgo: 0,  // This instant
      },
    ],
  }
);
```

## Error Handling Examples

```typescript
try {
  const report = await corsair.call(
    'googleanalytics4',
    'reporting.runReport',
    {
      property: 'properties/999999999', // Non-existent
      dateRanges: [{ startDate: '2024-01-01', endDate: '2024-01-31' }],
      metrics: [{ name: 'sessions' }],
    }
  );
} catch (error) {
  if (error.type === 'NOT_FOUND_ERROR') {
    console.log('Property does not exist');
  } else if (error.type === 'AUTH_ERROR') {
    console.log('Check credentials');
  } else if (error.type === 'RATE_LIMIT_ERROR') {
    console.log('Quota exceeded, retry later');
  }
}
```
