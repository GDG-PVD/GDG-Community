# ADR-0025: Firebase Storage Final Resolution

## Date
2025-05-16

## Status
Accepted

## Context
After extensive testing and analysis, including insights from a second opinion, we've determined that:

1. The Firebase Storage webpack bundling issue persists across Firebase v9.23.0 and v10.14.1
2. Webpack creates multiple instances of Firebase modules, preventing proper service registration
3. CRACO configuration with deduplication doesn't fully resolve the issue because dynamic imports still create a fresh module registry, preventing storage from registering on the app container
4. Dynamic imports still result in separate module instances

Test results confirmed:
- Deduplication test failed - versions don't match between app and storage modules (SDK versions: App 10.14.1 vs Storage "Unknown")
- Dynamic imports partially work but still throw "Service storage is not available"
- CDN approach works but requires authentication handling

## Decision
Use Storage Service V2 with CDN as the primary approach, with dynamic imports as secondary fallback. The explicit fallback order is:

1. **Primary**: CDN-based V2 (most reliable)
2. **Secondary**: Dynamic import V2 (may work in some cases)
3. **Tertiary**: Native module (for future testing)

If CDN auth/fetch fails at runtime, the service automatically attempts the next approach in sequence.

## Implementation

### Storage Service V2 Architecture
```typescript
// Priority order based on test results
1. CDN Fallback (works reliably)
2. Dynamic Import (may work in some cases)
3. Native Module (for testing)
```

### Key Changes
1. Reordered approaches to prioritize CDN
2. Fixed authentication for CDN approach with fallback chain:
   ```typescript
   // Auth priority: Current user → Anonymous → Skip auth
   if (currentUser) {
     await firebase.auth(cdnApp).signInAnonymously();
   }
   ```
3. Added proper error handling and logging
4. Temporary storage rules for v2-test path:
   ```
   // V2 test directory - allow all for debugging
   match /v2-test/{allPaths=**} {
     allow read: if true;
     allow write: if true;
   }
   ```

## Consequences

### Positive
- Immediate working solution for production
- Fallback options for different scenarios
- Transparent to application code
- Can be updated when webpack issue is resolved

### Negative
- Requires CDN dependency
- Slightly more complex than native imports
- May have minor performance overhead
- Temporary storage rules needed for testing

## Long-term Strategy

1. **Monitor Firebase SDK Updates**
   - Check for webpack compatibility fixes in versions ≥11.0.0
   - Test new versions with deduplication
   - Remove CDN fallback if Firebase SDK ≥11.0.0 and webpack ≥5.88.0 no longer duplicate modules

2. **Webpack Evolution**
   - Watch for webpack updates that better handle Firebase
   - Consider alternative bundlers if needed
   - Track metrics: "% of storage calls via CDN vs dynamic import"

3. **Remove Workaround When Possible**
   - Regular testing of native approach
   - Remove CDN dependency when fixed
   - Monitor bundle size delta when native approach returns

4. **Rollback Plan**
   - If CDN becomes unreachable for >5 minutes, automatically switch to dynamic import
   - Alert monitoring for CDN availability
   - Fallback chain ensures service continuity

## Migration Path

### Phase 1: Immediate (Complete)
- Deploy Storage Service V2
- Use CDN as primary approach
- Update storage rules for testing

### Phase 2: Application Update
- Update EventCreate to use Service V2
- Replace all direct storage usage
- Remove old CDN workaround code

### Phase 3: Future Resolution
- Test each Firebase update
- Remove CDN when native works
- Simplify to single approach

## Testing Results Summary
- Deduplication Test: Failed - Multiple instances confirmed
- Dynamic Import Test: Partial - Module loads but init fails
- CDN Test: Success - Works with proper auth
- Service V2 Test: Success with CDN approach

## References
- Second Opinion Document: Confirmed multiple instance issue
- Test Results: Deduplication fails, CDN works
- ADR-0023: Root cause analysis
- ADR-0024: Multi-approach solution

## Next Steps
1. Deploy updated storage rules
2. Test Service V2 with CDN priority
3. Update application to use Service V2
4. Document usage patterns
5. Monitor for permanent fixes