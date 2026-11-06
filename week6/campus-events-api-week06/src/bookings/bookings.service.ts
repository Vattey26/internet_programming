import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
import type { Booking } from './booking.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  // Nest creates EventsService once and passes it in: dependency injection
  constructor(private readonly events: EventsService) {}

  findAll(): Booking[] {
    return [...this.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  create(eventId: number, dto: CreateBookingDto): Booking {
    // 1. find the event - throws 404 automatically if not found
    const event = this.events.findOne(eventId);

    // 2. Check capacity
    const seatsLeft = event.capacity - event.booked;
    if (dto.seats > seatsLeft) {
      throw new ConflictException(`Only ${seatsLeft} seat(s) left`)
    }

    // 3. Increase booked seats and store new one
    event.booked += dto.seats;
    const booking: Booking = {
      id: this.nextId++,
      eventId,
      name: dto.name,
      email: dto.email,
      seats: dto.seats,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(booking);
    return booking;
  }

  remove(id: number): void {
    // 1. Find the booking - 404 if it doesn't exist
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);

    // 2. Give seats back to the event
    const event = this.events.findOne(booking.eventId);
    event.booked -= booking.seats;

    // 3. Remove the booking from the list
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }
}
