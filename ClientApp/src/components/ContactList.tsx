import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, PrimaryButton, Text, Stack, DefaultButton } from '@fluentui/react';
import axios from 'axios';
import ContactDetails from './ContactDetails';
import CreateContact from './CreateContact';
import EditContact from './EditContact';

interface Contact {
    id: number;
    name: string;
    surname: string;
}

const ContactList: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isCreateContactPanelOpen, setIsCreateContactPanelOpen] = useState(false);
    const [isEditContactPanelOpen, setIsEditContactPanelOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('/api/Contact');
                const sortedContacts = response.data.sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
                setContacts(sortedContacts);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        if (id) {
            setSelectedContactId(id);
        } else {
            setSelectedContactId(null);
        }
    }, [id]);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/Contact/${id}`);
            setContacts(contacts.filter(contact => contact.id !== id));
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const openCreateContactPanel = () => {
        setIsCreateContactPanelOpen(true);
    };

    const closeCreateContactPanel = () => {
        setIsCreateContactPanelOpen(false);
    };

    const openEditContactPanel = (id: string) => {
        setSelectedContactId(id);
        setIsEditContactPanelOpen(true);
    };

    const closeEditContactPanel = () => {
        setIsEditContactPanelOpen(false);
        setSelectedContactId(null);
        navigate('/');
    };

    const groupedContacts = contacts.reduce((acc: { [key: string]: Contact[] }, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(contact);
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '20px' }}>
            <Stack
                styles={{
                    root: {
                        flexGrow: 1,
                        overflowY: 'auto',  // Enable scrolling here only
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: '20px', // Add margin to the bottom
                    }
                }}
            >
                <Text variant="xxLarge" styles={{ root: { fontWeight: 700, marginBottom: '10px', marginTop: '20px' } }}>
                    Moji kontakti
                </Text>
                <PrimaryButton text="Dodaj novi kontakt" style={{ width: '800px', marginBottom: '20px', fontSize: '20px' }} onClick={openCreateContactPanel} />
                {Object.keys(groupedContacts).sort().map(letter => (
                    <div key={letter} style={{ marginBottom: '20px' }}>
                        <Text variant="xLarge">{letter}</Text>
                        <List
                            items={groupedContacts[letter]}
                            onRenderCell={(item) => (
                                item ? (
                                    <Stack
                                        horizontal
                                        verticalAlign="center"
                                        styles={{
                                            root: {
                                                margin: '15px 0',
                                                padding: '25px',
                                                border: '3px solid #f3f2f1',
                                                borderRadius: '4px',
                                                backgroundColor: '#fafafa',
                                                width: '800px',
                                                maxWidth: '800px',
                                            }
                                        }}
                                    >
                                        <Text variant="xxLarge" styles={{ root: { fontWeight: 600, flex: 1 } }} onClick={() => navigate(`/${item.id}`)}>
                                            {item.name} {item.surname}
                                        </Text>
                                        <PrimaryButton text="Uredi" style={{ marginLeft: '12px' }} onClick={() => openEditContactPanel(item.id.toString())} />
                                        <DefaultButton text="Obriši" style={{ marginLeft: '12px' }} onClick={() => handleDelete(item.id)} />
                                    </Stack>
                                ) : null
                            )}
                        />
                    </div>
                ))}
                <CreateContact
                    isOpen={isCreateContactPanelOpen}
                    contactId=""
                    onDismiss={closeCreateContactPanel}
                />
                {selectedContactId && (
                    <ContactDetails
                        isOpen={!!selectedContactId}
                        contactId={selectedContactId}
                        onDismiss={() => navigate('/')}
                    />
                )}
                {selectedContactId && (
                    <EditContact
                        isOpen={isEditContactPanelOpen}
                        contactId={selectedContactId}
                        onDismiss={closeEditContactPanel}
                    />
                )}
            </Stack>
        </div>
    );
};

export default ContactList;
