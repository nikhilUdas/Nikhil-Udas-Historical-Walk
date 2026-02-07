# Notification System API Documentation

## Overview
The notification system provides real-time notifications to users using Socket.io. Notifications are stored in the database and can be retrieved via REST API endpoints. All notification updates are broadcasted in real-time to connected clients.

---

## Features
✅ Real-time notifications via Socket.io  
✅ Persistent notification storage in database  
✅ Mark as read / Mark all as read  
✅ Delete notifications  
✅ Get unread notification count  
✅ Automatic notifications on:
- Ticket purchase
- New story added to heritage site
- New route added to heritage site

---

## Notification Model

```typescript
model Notification {
  notification_id Int      @id @default(autoincrement())
  user_id         Int
  type            String   // "ticket_purchased", "payment_status", "site_update", "story_added", "route_added"
  title           String
  message         String
  is_read         Boolean  @default(false)
  related_id      Int?     // Reference to museum_id, site_id, etc.
  created_at      DateTime @default(now())

  user User @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
}
```

---

## Socket.io Events

### Client Connection
**Event:** `connection`  
**Authentication:** Required (JWT token)  
**Handler:**
```javascript
socket.on('connected', (data) => {
  console.log('Connected to notification server:', data);
});
```

### Receive New Notification (Real-time)
**Event:** `new_notification`  
**Description:** Emitted to user when a new notification is created  
**Data:**
```json
{
  "notification": {
    "notification_id": 1,
    "user_id": 5,
    "type": "ticket_purchased",
    "title": "Ticket Purchased Successfully",
    "message": "Your ticket for Museum Name has been purchased successfully. Amount: Rs. 500",
    "is_read": false,
    "related_id": 3,
    "created_at": "2026-01-14T12:30:00Z"
  },
  "timestamp": "2026-01-14T12:30:00Z"
}
```

**JavaScript Example:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  auth: {
    token: 'your_jwt_token_here'
  }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});

socket.on('new_notification', (data) => {
  console.log('New notification received:', data.notification);
  // Update your UI here
});

socket.on('disconnect', () => {
  console.log('Disconnected from notification server');
});
```

---

## REST API Endpoints

### Base URL
```
http://localhost:8000/api/notifications
```

All endpoints require authentication with JWT Bearer token.

---

### 1. Get All Notifications
**Endpoint:** `GET /api/notifications`  
**Authentication:** Required  
**Description:** Retrieve all notifications for the authenticated user, sorted by newest first

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "notifications": [
    {
      "notification_id": 1,
      "user_id": 5,
      "type": "ticket_purchased",
      "title": "Ticket Purchased Successfully",
      "message": "Your ticket for Museum Name has been purchased successfully. Amount: Rs. 500",
      "is_read": false,
      "related_id": 3,
      "created_at": "2026-01-14T12:30:00Z"
    }
  ],
  "unreadCount": 2
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/notifications \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

### 2. Get Unread Notification Count
**Endpoint:** `GET /api/notifications/unread/count`  
**Authentication:** Required  
**Description:** Get count of unread notifications only

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "unreadCount": 3
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/notifications/unread/count \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

### 3. Mark Notification as Read
**Endpoint:** `PUT /api/notifications/:notificationId/read`  
**Authentication:** Required  
**Method:** PUT  
**Description:** Mark a specific notification as read

**URL Parameters:**
- `notificationId` (required): The ID of the notification to mark as read

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "message": "Notification marked as read",
  "notification": {
    "notification_id": 1,
    "user_id": 5,
    "type": "ticket_purchased",
    "title": "Ticket Purchased Successfully",
    "message": "Your ticket for Museum Name has been purchased successfully. Amount: Rs. 500",
    "is_read": true,
    "related_id": 3,
    "created_at": "2026-01-14T12:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Notification not found"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/notifications/1/read \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

### 4. Mark All Notifications as Read
**Endpoint:** `PUT /api/notifications/read/all`  
**Authentication:** Required  
**Method:** PUT  
**Description:** Mark all unread notifications as read for the authenticated user

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/notifications/read/all \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

### 5. Delete Notification
**Endpoint:** `DELETE /api/notifications/:notificationId`  
**Authentication:** Required  
**Method:** DELETE  
**Description:** Delete a specific notification

**URL Parameters:**
- `notificationId` (required): The ID of the notification to delete

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "message": "Notification deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Notification not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/notifications/1 \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

### 6. Delete All Notifications
**Endpoint:** `DELETE /api/notifications/all`  
**Authentication:** Required  
**Method:** DELETE  
**Description:** Delete all notifications for the authenticated user

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "message": "All notifications deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/notifications/all \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

## Automatic Notification Types

### 1. Ticket Purchased
**Type:** `ticket_purchased`  
**Triggered:** When user purchases a museum ticket  
**Example:**
```json
{
  "type": "ticket_purchased",
  "title": "Ticket Purchased Successfully",
  "message": "Your ticket for Museum Name has been purchased successfully. Amount: Rs. 500",
  "related_id": "museum_id"
}
```

### 2. Story Added
**Type:** `story_added`  
**Triggered:** When admin adds a new story to a heritage site  
**Broadcast:** To ALL connected users  
**Example:**
```json
{
  "type": "story_added",
  "title": "New Story Added",
  "message": "A new story 'Story Title' has been added to Heritage Site Name. Learn about God/Goddess Name!",
  "related_id": "heritage_site_id"
}
```

---

## Client Implementation Examples

### React with Socket.io

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io('http://localhost:8000', {
      auth: {
        token: jwtToken
      }
    });

    // Listen for new notifications
    socket.on('new_notification', (data) => {
      const { notification } = data;
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Fetch existing notifications
    fetchNotifications();

    return () => socket.disconnect();
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch('http://localhost:8000/api/notifications', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    const data = await response.json();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  const markAsRead = async (notificationId) => {
    await fetch(`http://localhost:8000/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    setUnreadCount((prev) => prev - 1);
  };

  return (
    <div className="notification-panel">
      <h2>Notifications ({unreadCount} unread)</h2>
      {notifications.map((notif) => (
        <div key={notif.notification_id} className="notification-item">
          <h3>{notif.title}</h3>
          <p>{notif.message}</p>
          {!notif.is_read && (
            <button onClick={() => markAsRead(notif.notification_id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;
```

### Vue.js with Socket.io

```vue
<template>
  <div class="notification-panel">
    <h2>Notifications ({{ unreadCount }} unread)</h2>
    <div v-for="notif in notifications" :key="notif.notification_id" class="notification-item">
      <h3>{{ notif.title }}</h3>
      <p>{{ notif.message }}</p>
      <button v-if="!notif.is_read" @click="markAsRead(notif.notification_id)">
        Mark as Read
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import io from 'socket.io-client';

const notifications = ref([]);
const unreadCount = ref(0);
const jwtToken = localStorage.getItem('token');
let socket;

onMounted(() => {
  // Initialize Socket.io
  socket = io('http://localhost:8000', {
    auth: {
      token: jwtToken
    }
  });

  socket.on('new_notification', (data) => {
    notifications.value.unshift(data.notification);
    unreadCount.value++;
  });

  fetchNotifications();
});

onBeforeUnmount(() => {
  socket.disconnect();
});

async function fetchNotifications() {
  const response = await fetch('http://localhost:8000/api/notifications', {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  const data = await response.json();
  notifications.value = data.notifications;
  unreadCount.value = data.unreadCount;
}

async function markAsRead(notificationId) {
  await fetch(`http://localhost:8000/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  unreadCount.value--;
}
</script>
```

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (if applicable)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (notification not found)
- `500` - Internal Server Error

---

## Security Considerations

1. **JWT Authentication:** All endpoints require valid JWT tokens
2. **User Isolation:** Users can only access their own notifications
3. **Real-time Validation:** Socket.io connections are validated on every message
4. **CORS Configuration:** Socket.io is configured to only accept connections from allowed origins

---

## Testing the Notification System

### Test 1: Manual Socket.io Test
```javascript
// Run this in browser console
const socket = io('http://localhost:8000', {
  auth: {
    token: 'your_jwt_token_here'
  }
});

socket.on('connected', (data) => console.log('Connected:', data));
socket.on('new_notification', (data) => console.log('Notification:', data));
```

### Test 2: Purchase Ticket (Triggers Notification)
```bash
curl -X POST http://localhost:8000/api/museums/ticket/purchase \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "museum_id": 1,
    "price": 500,
    "payment_method": "card"
  }'
```

### Test 3: Get Notifications
```bash
curl -X GET http://localhost:8000/api/notifications \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Troubleshooting

**Issue:** Socket connection fails with "Authentication error"  
**Solution:** Ensure JWT token is valid and included in auth header

**Issue:** Notifications not appearing in real-time  
**Solution:** Check if Socket.io server is running on correct port (8000) and CORS is properly configured

**Issue:** Database errors when creating notifications  
**Solution:** Ensure Prisma migrations have been applied: `npx prisma migrate dev`

---

## Future Enhancements

- [ ] Notification preferences (email, push, in-app)
- [ ] Notification categories/filtering
- [ ] Bulk mark as read
- [ ] Notification scheduling
- [ ] Push notifications
- [ ] Read receipts

