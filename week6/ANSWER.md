# Explain

**1. `DELTE /events/2` returns 204 and the second call returns 404. Is Delete still Idempotent means.**
    *answer:* Yes Idempotent means that sending the same request many times leaves the server in the same state as sending it once. After the first call event 2 is gone, and after second call is still gone, so the state does not change. Only the response differs (204, then 404), and the itempotent is about the effect on the server, not about getting the same response.

**2. The Vue app port 5173 calls the API on port 300. Which program blocks the response when CORS is not configured, and why can `curl` read it anyway?**
    *answer:* The browser blocks it. The server which port 3000 still answers, but the browser sees that the reponse has no `Access-Control-Allow-Origin` header allowing the origin `localhost:5173`, so it refuses to give the response to the Vue app's JavaScript. CORS is a browser Security rule(same-origin policy), not a server rule. curl is not a browser and does not enforcve it, so it prints the response normally.

**3. `EventsController` never writes `new EventsService()`. Who creates the service, when and how many are created?**
    *answer:* NestJS’s dependency injection container creates it. Because `EventsService` is listed as a provider in `EventsModule` and marked `@Injectable`(), Nest builds it once when the application starts (bootstrap). It then passes that instance into the `EventsController` constructor. By default providers are singletons, so exactly one instance exists and every request shares it (which is also why the in-memory data persists between requests).

**4. A client sends `{ "title": "Pitch Night", ..., "booked": 50 }`. Which line of code refuses it, and what would happen to booked without it?**
    *answer:* The `forbidNonWhitelisted: true` option in the `ValidationPipe` in `src/setup.ts` refuses it, returning 400 because booked is not a field of `CreateEventDto`. Without it,` whitelist: true` alone would silently strip `booked` and the request would succeed. If both options were missing, `booked: 50` would reach the service and a client could set the number of booked seats directly, bypassing the booking rules.

**5. Why is the “not enough seats” rule in `BookingsService` and not in `BookingsController` or only in the Vue form?**
    *answer:* The service is where business rules belong. The controller should only handle HTTP (routes, status codes, params) and call the service, so the rule stays in one place and can be unit tested without HTTP. A rule that exists only in the Vue form can be bypassed by anyone calling the API directly with curl or another client. The server is the only place that can check the seats reliably against the real data, in a single request.