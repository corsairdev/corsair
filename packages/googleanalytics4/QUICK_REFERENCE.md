# Google Analytics 4 Plugin - Quick Reference

## Import

```typescript
import { googleanalytics4 } from '@corsairdev/googleanalytics4';
```

## Initialize

```typescript
const ga4 = googleanalytics4({
  authType: 'oauth_2',  // default
  permissions: {
    'properties.create': true,
    'measurementProtocol.sendEvent': true,
  }
});
```

## Admin API Quick Calls

### Accounts
```typescript
// List accounts
await corsair.call('googleanalytics4', 'accounts.list', {});

// Get account
await corsair.call('googleanalytics4', 'accounts.get', {
  name: 'accounts/123456789'
});
```

### Properties
```typescript
// List properties
await corsair.call('googleanalytics4', 'properties.list', {
  filter: 'parent:accounts/123456789'
});

// Get property
await corsair.call('googleanalytics4', 'properties.get', {
  name: 'properties/987654321'
});

// Create property
await corsair.call('googleanalytics4', 'properties.create', {
  displayName: 'My Site',
  parentAccount: 'accounts/123456789',
  timeZone: 'America/New_York',
  currencyCode: 'USD'
});

// Update property
await corsair.call('googleanalytics4', 'properties.update', {
  name: 'properties/987654321',
  timeZone: 'Europe/London',
  updateMask: 'timeZone'
});
```

### Custom Dimensions
```typescript
// List
await corsair.call('googleanalytics4', 'customDimensions.list', {
  parent: 'properties/987654321'
});

// Create
await corsair.call('googleanalytics4', 'customDimensions.create', {
  parent: 'properties/987654321',
  customDimension: {
    parameterName: 'subscription_tier',
    displayName: 'Subscription Tier',
    scope: 'USER'  // USER, EVENT, ITEM
  }
});
```

### Custom Metrics
```typescript
// List
await corsair.call('googleanalytics4', 'customMetrics.list', {
  parent: 'properties/987654321'
});

// Create
await corsair.call('googleanalytics4', 'customMetrics.create', {
  parent: 'properties/987654321',
  customMetric: {
    parameterName: 'purchase_value',
    displayName: 'Purchase Value',
    measurementUnit: 'CURRENCY',  // STANDARD, CURRENCY, FEET, etc
    scope: 'EVENT'
  }
});
```

### Data Streams
```typescript
// List
await corsair.call('googleanalytics4', 'dataStreams.list', {
  parent: 'properties/987654321'
});

// Get (includes measurement ID)
await corsair.call('googleanalytics4', 'dataStreams.get', {
  name: 'properties/987654321/dataStreams/123456789'
});
```

### Audiences
```typescript
// List
await corsair.call('googleanalytics4', 'audiences.list', {
  parent: 'properties/987654321'
});

// Create
await corsair.call('googleanalytics4', 'audiences.create', {
  parent: 'properties/987654321',
  audience: {
    displayName: 'High Value Users',
    filterClauses: [{
      clauseType: 'ANDed',
      simpleOperand: {
        scope: 'USER',
        filterExpression: 'lifetime_value > 1000'
      }
    }]
  }
});
```

## Data API Quick Calls

### Standard Report
```typescript
await corsair.call('googleanalytics4', 'reporting.runReport', {
  property: 'properties/987654321',
  dateRanges: [{
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  }],
  metrics: [
    { name: 'sessions' },
    { name: 'activeUsers' }
  ],
  dimensions: [
    { name: 'country' }
  ],
  limit: 250
});
```

### Realtime Report
```typescript
await corsair.call('googleanalytics4', 'reporting.runRealtimeReport', {
  property: 'properties/987654321',
  metrics: [
    { name: 'activeUsers' }
  ],
  dimensions: [
    { name: 'country' }
  ],
  minuteRanges: [{
    startMinutesAgo: 30,
    endMinutesAgo: 0
  }]
});
```

## Measurement Protocol Quick Calls

### Send Event
```typescript
await corsair.call('googleanalytics4', 'measurementProtocol.sendEvent', {
  measurementId: 'G-XXXXXXXXXX',
  apiSecret: 'your_secret',
  clientId: 'user123',
  userId: 'user@example.com',
  events: [{
    name: 'purchase',
    params: {
      value: 99.99,
      currency: 'USD',
      items: [{
        item_id: 'SKU_123',
        item_name: 'Product',
        quantity: 1,
        price: 99.99
      }]
    }
  }]
});
```

### Validate Event
```typescript
await corsair.call('googleanalytics4', 'measurementProtocol.validate', {
  measurementId: 'G-XXXXXXXXXX',
  apiSecret: 'your_secret',
  clientId: 'user123',
  events: [{
    name: 'purchase',
    params: { value: 99.99 }
  }]
});
```

## Common Parameters

### Dimensions
Common dimension names:
- `country`, `city`, `region`
- `deviceCategory`, `operatingSystem`, `browser`
- `pagePath`, `pageTitle`, `hostname`
- `eventName`, `eventCategory`
- `date`, `dateHour`, `week`

### Metrics
Common metric names:
- `activeUsers`, `sessions`, `bounceRate`
- `pageViews`, `screenPageViews`
- `eventCount`, `totalRevenue`
- `averageSessionDuration`, `engagementRate`
- `conversionRate`, `returnVisitorCount`

### Filter Operators
- `EXACT` - Exact match
- `BEGINS_WITH` - Starts with
- `ENDS_WITH` - Ends with
- `CONTAINS` - Contains substring
- `FULL_REGEXP` - Full regular expression
- `PARTIAL_REGEXP` - Partial regular expression

## Error Types
- `AUTH_ERROR` - Authentication failed
- `NOT_FOUND_ERROR` - Resource not found
- `RATE_LIMIT_ERROR` - Quota exceeded
- `BAD_REQUEST_ERROR` - Invalid parameters
- `SERVER_ERROR` - GA4 server error
- `NETWORK_ERROR` - Network issue
- `TIMEOUT_ERROR` - Request timeout

## Tips & Tricks

### Multi-date Range Comparison
```typescript
dateRanges: [
  { startDate: '2024-01-01', endDate: '2024-01-31', name: 'This Month' },
  { startDate: '2023-12-01', endDate: '2023-12-31', name: 'Last Month' }
]
```

### Top N Results
```typescript
orderBys: [
  {
    metric: { metricName: 'sessions' },
    desc: true
  }
],
limit: 10
```

### Filter by Page Path
```typescript
filters: [{
  fieldName: 'pagePath',
  stringFilter: {
    matchType: 'BEGINS_WITH',
    value: '/products',
    caseSensitive: false
  }
}]
```

### Realtime for Last 5 Minutes
```typescript
minuteRanges: [{
  startMinutesAgo: 5,
  endMinutesAgo: 0
}]
```

### Batch Events
```typescript
events: [
  { name: 'page_view', params: { page_title: 'Home' } },
  { name: 'scroll', params: { scroll_depth: 50 } },
  { name: 'click', params: { button_name: 'Buy Now' } }
]
```

## Docs Quick Links

- **Full API Reference**: [README.md](README.md)
- **Code Examples**: [EXAMPLES.md](EXAMPLES.md)
- **Setup & Deploy**: [SETUP.md](SETUP.md)
- **Architecture**: [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **File Structure**: [PLUGIN_STRUCTURE.md](PLUGIN_STRUCTURE.md)

---

**Last Updated**: August 2026  
**Plugin**: Google Analytics 4 (googleanalytics4)  
**Version**: 0.0.1
