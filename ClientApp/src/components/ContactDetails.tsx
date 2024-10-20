import React, { useEffect, useState } from 'react';
import { Text } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import axios from 'axios';

initializeIcons();

interface Email {
    id: number;
    contactId: number;
    emailAddress: string;
    category: string;
}

interface Phone {
    id: number;
    contactId: number;
    phoneNumber: string;
    category: string;
}

interface Contact {
    id: number;
    name: string;
    surname: string;
    address: string;
    emails: Email[];
    phones: Phone[];
}

interface ContactDetailsProps {
    isOpen: boolean;
    contactId: string;
    onDismiss: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ isOpen, contactId, onDismiss }) => {
    const [contact, setContact] = useState<Contact | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await axios.get(`/api/Contact/${contactId}`);
                setContact(response.data);
            } catch (error) {
                console.error('Error fetching contact:', error);
            }
        };

        fetchContact();
    }, [contactId]);

    return (
        <div>
            <Panel isOpen={isOpen} onDismiss={onDismiss} headerText="Podaci o kontaktu"
                styles={{ headerText: { fontSize: '40px', fontWeight: 'bold' } }} closeButtonAriaLabel='Zatvori'
                isFooterAtBottom={true} isLightDismiss={true} type={PanelType.customNear} customWidth="600px" isBlocking={true} >
                {contact && (
                    <>
                        <Text variant="xxLarge" block>Ime i prezime: {contact.name} {contact.surname}</Text>
                        <Text variant="xxLarge" block>Adresa: {contact.address}</Text>
                        <Text variant="xxLarge" block>Email adrese:</Text>
                        <ul>
                            {contact.emails.map(email => (
                                <li key={email.id} style={{ fontSize: '22px' }}>
                                    {email.emailAddress} ({email.category})
                                </li>
                            ))}
                        </ul>
                        <Text variant="xxLarge" block>Brojevi telefona:</Text>
                        <ul>
                            {contact.phones.map(phone => (
                                <li key={phone.id} style={{ fontSize: '22px' }}>
                                    {phone.phoneNumber} ({phone.category})
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Panel>
        </div>
    );
};

export default ContactDetails;