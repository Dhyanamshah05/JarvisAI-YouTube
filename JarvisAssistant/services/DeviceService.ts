import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import * as Location from 'expo-location';
import { Linking, Alert } from 'react-native';

export interface DeviceAction {
  type: 'contact' | 'calendar' | 'app' | 'system';
  action: string;
  data?: any;
}

export class DeviceService {
  
  async requestPermissions(): Promise<void> {
    try {
      // Request contacts permission
      const { status: contactsStatus } = await Contacts.requestPermissionsAsync();
      if (contactsStatus !== 'granted') {
        console.warn('Contacts permission not granted');
      }

      // Request calendar permission
      const { status: calendarStatus } = await Calendar.requestCalendarPermissionsAsync();
      if (calendarStatus !== 'granted') {
        console.warn('Calendar permission not granted');
      }

      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        console.warn('Location permission not granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  }

  async executeDeviceAction(action: DeviceAction): Promise<string> {
    try {
      switch (action.type) {
        case 'contact':
          return await this.handleContactAction(action.action, action.data);
        case 'calendar':
          return await this.handleCalendarAction(action.action, action.data);
        case 'app':
          return await this.handleAppAction(action.action, action.data);
        case 'system':
          return await this.handleSystemAction(action.action, action.data);
        default:
          return "I don't know how to handle that device action.";
      }
    } catch (error) {
      console.error('Error executing device action:', error);
      return "I encountered an error while trying to do that.";
    }
  }

  private async handleContactAction(action: string, data?: any): Promise<string> {
    switch (action) {
      case 'find':
        return await this.findContact(data.name);
      case 'call':
        return await this.callContact(data.name);
      default:
        return "I don't know how to handle that contact action.";
    }
  }

  private async handleCalendarAction(action: string, data?: any): Promise<string> {
    switch (action) {
      case 'create_event':
        return await this.createCalendarEvent(data);
      case 'get_events':
        return await this.getTodaysEvents();
      default:
        return "I don't know how to handle that calendar action.";
    }
  }

  private async handleAppAction(action: string, data?: any): Promise<string> {
    switch (action) {
      case 'open':
        return await this.openApp(data.url);
      default:
        return "I don't know how to handle that app action.";
    }
  }

  private async handleSystemAction(action: string, data?: any): Promise<string> {
    switch (action) {
      case 'settings':
        return await this.openSettings();
      default:
        return "I don't know how to handle that system action.";
    }
  }

  private async findContact(name: string): Promise<string> {
    try {
      const { data: contacts } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const matchingContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(name.toLowerCase())
      );

      if (matchingContacts.length === 0) {
        return `I couldn't find any contacts matching "${name}".`;
      } else if (matchingContacts.length === 1) {
        const contact = matchingContacts[0];
        return `I found ${contact.name}. They have ${contact.phoneNumbers?.length || 0} phone numbers.`;
      } else {
        return `I found ${matchingContacts.length} contacts matching "${name}".`;
      }
    } catch (error) {
      return "I need permission to access your contacts to do that.";
    }
  }

  private async callContact(name: string): Promise<string> {
    try {
      const { data: contacts } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const matchingContact = contacts.find(contact =>
        contact.name?.toLowerCase().includes(name.toLowerCase())
      );

      if (!matchingContact) {
        return `I couldn't find a contact named "${name}".`;
      }

      if (!matchingContact.phoneNumbers || matchingContact.phoneNumbers.length === 0) {
        return `${matchingContact.name} doesn't have any phone numbers.`;
      }

      const phoneNumber = matchingContact.phoneNumbers[0].number;
      const url = `tel:${phoneNumber}`;
      
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return `Calling ${matchingContact.name}...`;
      } else {
        return "I can't make phone calls on this device.";
      }
    } catch (error) {
      return "I need permission to access your contacts to make calls.";
    }
  }

  private async createCalendarEvent(eventData: any): Promise<string> {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.source?.name === 'Default') || calendars[0];

      if (!defaultCalendar) {
        return "I couldn't find a calendar to add the event to.";
      }

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: eventData.title || 'New Event',
        startDate: eventData.startDate || new Date(),
        endDate: eventData.endDate || new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
        notes: eventData.notes || '',
      });

      return `I've created the event "${eventData.title}" in your calendar.`;
    } catch (error) {
      return "I need permission to access your calendar to create events.";
    }
  }

  private async getTodaysEvents(): Promise<string> {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const events = await Calendar.getEventsAsync(
        calendars.map(cal => cal.id),
        startOfDay,
        endOfDay
      );

      if (events.length === 0) {
        return "You have no events scheduled for today.";
      } else if (events.length === 1) {
        return `You have 1 event today: ${events[0].title}`;
      } else {
        return `You have ${events.length} events today. The next one is: ${events[0].title}`;
      }
    } catch (error) {
      return "I need permission to access your calendar to check your events.";
    }
  }

  private async openApp(url: string): Promise<string> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return "Opening the app...";
      } else {
        return "I can't open that app on this device.";
      }
    } catch (error) {
      return "I encountered an error trying to open that app.";
    }
  }

  private async openSettings(): Promise<string> {
    try {
      await Linking.openSettings();
      return "Opening device settings...";
    } catch (error) {
      return "I can't open settings on this device.";
    }
  }

  // Parse natural language commands to device actions
  parseDeviceCommand(command: string): DeviceAction | null {
    const lowerCommand = command.toLowerCase();

    // Contact commands
    if (lowerCommand.includes('call') || lowerCommand.includes('phone')) {
      const nameMatch = lowerCommand.match(/call (\w+)|phone (\w+)/);
      if (nameMatch) {
        return {
          type: 'contact',
          action: 'call',
          data: { name: nameMatch[1] || nameMatch[2] }
        };
      }
    }

    if (lowerCommand.includes('find contact') || lowerCommand.includes('search contact')) {
      const nameMatch = lowerCommand.match(/find contact (\w+)|search contact (\w+)/);
      if (nameMatch) {
        return {
          type: 'contact',
          action: 'find',
          data: { name: nameMatch[1] || nameMatch[2] }
        };
      }
    }

    // Calendar commands
    if (lowerCommand.includes('create event') || lowerCommand.includes('schedule')) {
      return {
        type: 'calendar',
        action: 'create_event',
        data: { title: 'New Event' } // Could be enhanced to parse more details
      };
    }

    if (lowerCommand.includes('my events') || lowerCommand.includes('schedule today')) {
      return {
        type: 'calendar',
        action: 'get_events'
      };
    }

    // App commands
    if (lowerCommand.includes('open') && (lowerCommand.includes('maps') || lowerCommand.includes('navigation'))) {
      return {
        type: 'app',
        action: 'open',
        data: { url: 'maps://' }
      };
    }

    if (lowerCommand.includes('open settings')) {
      return {
        type: 'system',
        action: 'settings'
      };
    }

    return null;
  }
}

export default new DeviceService();