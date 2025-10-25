const STORAGE_KEY = 'tria-contacts';
const GROUPS_STORAGE_KEY = 'tria-groups';

export const dataService = {
  // Load contacts from localStorage or return default data
  async loadContacts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // If no stored data, load from contacts.json (initial data)
      const response = await fetch('/public/contacts.json');
      const contacts = await response.json();
      this.saveContacts(contacts);
      return contacts;
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  },

  // Save contacts to localStorage
  saveContacts(contacts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      return true;
    } catch (error) {
      console.error('Error saving contacts:', error);
      return false;
    }
  },

  // Add a new contact
  async addContact(contactData) {
    try {
      const contacts = await this.loadContacts();
      const newContact = {
        ...contactData,
        id: crypto.randomUUID(),
        createdDate: new Date().toISOString(),
        createdBy: 'current-user',
        isFavorite: false,
        groupId: null,
        isArchived: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${contactData.name}`
      };
      
      const updatedContacts = [...contacts, newContact];
      this.saveContacts(updatedContacts);
      return newContact;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  // Update an existing contact
  async updateContact(contactId, contactData) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId 
          ? { 
              ...contact, 
              ...contactData,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${contactData.name}`
            }
          : contact
      );
      
      this.saveContacts(updatedContacts);
      return updatedContacts.find(contact => contact.id === contactId);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete a contact
  async deleteContact(contactId) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      this.saveContacts(updatedContacts);
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // Toggle favorite status
  async toggleFavorite(contactId) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      );
      
      this.saveContacts(updatedContacts);
      return updatedContacts.find(contact => contact.id === contactId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Bulk operations
  async bulkUpdateContacts(contactIds, updates) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.map(contact => 
        contactIds.includes(contact.id) 
          ? { ...contact, ...updates }
          : contact
      );
      
      this.saveContacts(updatedContacts);
      return true;
    } catch (error) {
      console.error('Error bulk updating contacts:', error);
      throw error;
    }
  },

  // Delete multiple contacts
  async bulkDeleteContacts(contactIds) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.filter(contact => !contactIds.includes(contact.id));
      this.saveContacts(updatedContacts);
      return true;
    } catch (error) {
      console.error('Error bulk deleting contacts:', error);
      throw error;
    }
  },

  // Group management methods
  async loadGroups() {
    try {
      const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // If no stored data, load from groups.json (initial data)
      const response = await fetch('/public/groups.json');
      const groups = await response.json();
      this.saveGroups(groups);
      return groups;
    } catch (error) {
      console.error('Error loading groups:', error);
      return [];
    }
  },

  saveGroups(groups) {
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      return true;
    } catch (error) {
      console.error('Error saving groups:', error);
      return false;
    }
  },

  async createGroup(groupData) {
    try {
      const groups = await this.loadGroups();
      const newGroup = {
        ...groupData,
        id: crypto.randomUUID(),
        createdDate: new Date().toISOString(),
        memberCount: 0
      };
      
      const updatedGroups = [...groups, newGroup];
      this.saveGroups(updatedGroups);
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  async updateGroup(groupId, groupData) {
    try {
      const groups = await this.loadGroups();
      const updatedGroups = groups.map(group => 
        group.id === groupId 
          ? { ...group, ...groupData }
          : group
      );
      
      this.saveGroups(updatedGroups);
      return updatedGroups.find(group => group.id === groupId);
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  async deleteGroup(groupId) {
    try {
      const groups = await this.loadGroups();
      const updatedGroups = groups.filter(group => group.id !== groupId);
      this.saveGroups(updatedGroups);
      
      // Remove groupId from all contacts
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.map(contact => 
        contact.groupId === groupId 
          ? { ...contact, groupId: null }
          : contact
      );
      this.saveContacts(updatedContacts);
      
      return true;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  async addContactsToGroup(contactIds, groupId) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.map(contact => 
        contactIds.includes(contact.id)
          ? { ...contact, groupId: groupId }
          : contact
      );
      
      this.saveContacts(updatedContacts);
      
      // Update group member count
      const groups = await this.loadGroups();
      const group = groups.find(g => g.id === groupId);
      if (group) {
        const contactsInGroup = updatedContacts.filter(c => c.groupId === groupId);
        await this.updateGroup(groupId, { memberCount: contactsInGroup.length });
      }
      
      return true;
    } catch (error) {
      console.error('Error adding contacts to group:', error);
      throw error;
    }
  },

  async removeContactFromGroup(contactId) {
    try {
      const contacts = await this.loadContacts();
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId
          ? { ...contact, groupId: null }
          : contact
      );
      
      this.saveContacts(updatedContacts);
      
      // Update group member count
      const contact = contacts.find(c => c.id === contactId);
      if (contact && contact.groupId) {
        const groups = await this.loadGroups();
        const group = groups.find(g => g.id === contact.groupId);
        if (group) {
          const contactsInGroup = updatedContacts.filter(c => c.groupId === contact.groupId);
          await this.updateGroup(contact.groupId, { memberCount: contactsInGroup.length });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error removing contact from group:', error);
      throw error;
    }
  },

  async getContactsInGroup(groupId) {
    try {
      const contacts = await this.loadContacts();
      return contacts.filter(contact => contact.groupId === groupId);
    } catch (error) {
      console.error('Error getting contacts in group:', error);
      return [];
    }
  }
};
