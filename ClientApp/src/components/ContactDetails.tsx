import React, { useEffect, useState } from 'react';
import { Text, Stack, Separator, Icon } from '@fluentui/react';
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
            <Panel
                isOpen={isOpen}
                onDismiss={onDismiss}
                headerText="Podaci o kontaktu"
                styles={{ headerText: { fontSize: '40px', fontWeight: 'bold' } }}
                closeButtonAriaLabel="Zatvori"
                isFooterAtBottom={true}
                isLightDismiss={true}
                type={PanelType.customNear}
                customWidth="600px"
                isBlocking={true}
            >
                {contact && (
                    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: '20px' } }}>
                        <Text variant="xxLarge" block>
                            <Icon iconName="Contact" styles={{ root: { marginRight: '8px' } }} />
                            {contact.name} {contact.surname}
                        </Text>
                        <Text variant="large" block>
                            <Icon iconName="Home" styles={{ root: { marginRight: '8px' } }} />
                            {contact.address}
                        </Text>
                        <Separator />
                        <Text variant="xLarge" block>
                            Email adrese:
                        </Text>
                        <Stack tokens={{ childrenGap: 10 }}>
                            {contact.emails.map((email) => (
                                <Stack horizontal key={email.id} tokens={{ childrenGap: 10 }} verticalAlign="center">
                                    <Icon iconName="Mail" styles={{ root: { fontSize: '22px' } }} />
                                    <Text variant="large">{email.emailAddress}</Text>
                                    <Text variant="smallPlus" styles={{ root: { color: '#888' } }}>
                                        ({email.category})
                                    </Text>
                                </Stack>
                            ))}
                        </Stack>
                        <Separator />
                        <Text variant="xLarge" block>
                            Brojevi telefona:
                        </Text>
                        <Stack tokens={{ childrenGap: 10 }}>
                            {contact.phones.map((phone) => (
                                <Stack horizontal key={phone.id} tokens={{ childrenGap: 10 }} verticalAlign="center">
                                    <Icon iconName="Phone" styles={{ root: { fontSize: '22px' } }} />
                                    <Text variant="large">{phone.phoneNumber}</Text>
                                    <Text variant="smallPlus" styles={{ root: { color: '#888' } }}>
                                        ({phone.category})
                                    </Text>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                )}
            </Panel>
        </div>
    );
};

export default ContactDetails;