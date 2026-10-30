# Week 5 Answers

## 1. Refreshing on `/events/2`

In development, the Vite dev server answered the request. It sees that `/events/2` is not a real file and sends back `index.html`, and then Vue Router reads the URL in the browser and shows the right page. After deployment, the production server must do the same: for any path that is not a real file (like `/assets/app.js`), return `index.html` instead of a 404. For example, nginx needs `try_files $uri /index.html;`. Without this, refreshing or opening a link to `/events/2` would give a 404 from the server.

## 2. The guard and `/events/new`

Yes, a student can still create an event. The guard only runs in the browser, so a student can skip the page and send `POST /events` directly with curl, Postman or the DevTools console. The server must stop them: it has to check who is making each request (authentication) and whether that user is an organiser (authorisation), and reject others with 401 or 403. The guard is only there to give users a better experience, not to protect the data.

## 3. `watch` with `immediate: true` instead of `onMounted`

`onMounted` runs only once, when the component is first created. Vue Router reuses the same `EventDetailPage` component when only the `:id` changes (for example, going from `/events/2` to `/events/3`), so `onMounted` would not run again. The page would keep showing the old event, which is stale data. A `watch` on the id with `immediate: true` loads the event on the first render and again every time the id changes.

## 4. `storeToRefs(store)` instead of `const { events } = store`

Destructuring `const { events } = store` copies the current value out of the store, so the variable is no longer connected to it. When the store later loads the events, the page would not update. `storeToRefs(store)` gives back refs that stay linked to the store's state (and its getters), so the template re-renders whenever the data changes. Actions like `fetchAll` are plain functions, so they can be destructured safely.

## 5. Two requests: POST the booking, then PATCH the seat count

If the POST succeeds and the PATCH fails, the booking is saved but the event's `booked` number is never increased. The data is now inconsistent: the event looks like it has more seats left than it really does, so it can be overbooked. The server can avoid this by doing both changes in one operation, for example a single endpoint like `POST /events/:id/bookings` that checks the seats and saves the booking and the new count together in one database transaction, so that either both succeed or neither does.