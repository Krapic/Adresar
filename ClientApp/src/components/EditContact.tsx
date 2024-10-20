import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { PrimaryButton, Stack, TextField, Dropdown, Dialog, DialogType } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';

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

interface EditContactProps {
    isOpen: boolean;
    contactId: string;
    onDismiss: () => void;
}

const EditContact: React.FC<EditContactProps> = ({ isOpen, contactId, onDismiss }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [address, setAddress] = useState('');
    const [emails, setEmails] = useState<Email[]>([]);
    const [phones, setPhones] = useState<Phone[]>([]);
    const [categories, setCategories] = useState<string[]>(['Kuća', 'Posao', 'Osobno', 'Sport', 'Banka', 'Fast Food', 'Drugo']);
    const [newCategory, setNewCategory] = useState('');
    const [isAddCategoryDialogVisible, { setTrue: showAddCategoryDialog, setFalse: hideAddCategoryDialog }] = useBoolean(false);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await axios.get(`/api/Contact/${contactId}`);
                const contact = response.data;
                setName(contact.name);
                setSurname(contact.surname);
                setAddress(contact.address);
                setEmails(contact.emails);
                setPhones(contact.phones);
            } catch (error) {
                console.error('Error fetching contact:', error);
            }
        };

        fetchContact();
    }, [contactId]);

    const handleDismissPanel = () => {
        onDismiss();
        navigate('/');
    };

    const handleAddEmail = () => {
        setEmails([...emails, { id: -Date.now(), contactId: Number(contactId), emailAddress: '', category: '' }]);
    };

    const handleAddPhone = () => {
        setPhones([...phones, { id: -Date.now(), contactId: Number(contactId), phoneNumber: '', category: '' }]);
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index].emailAddress = value;
        setEmails(newEmails);
    };

    const handlePhoneChange = (index: number, value: string) => {
        const newPhones = [...phones];
        newPhones[index].phoneNumber = value;
        setPhones(newPhones);
    };

    const handleCategoryChange = (index: number, value: string, type: 'email' | 'phone') => {
        if (value === 'add_new_category') {
            showAddCategoryDialog();
            return;
        }

        if (type === 'email') {
            const newEmails = [...emails];
            newEmails[index].category = value;
            setEmails(newEmails);
        } else {
            const newPhones = [...phones];
            newPhones[index].category = value;
            setPhones(newPhones);
        }
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
            hideAddCategoryDialog();
        }
    };

    const handleDeleteEmail = async (index: number) => {
        const emailToDelete = emails[index];
        setEmails(emails.filter((_, i) => i !== index));
        try {
            await axios.delete(`/api/Contact/Email/${emailToDelete.id}`);
        } catch (error) {
            console.error('Error deleting email:', error);
        }
    };

    const handleDeletePhone = async (index: number) => {
        const phoneToDelete = phones[index];
        setPhones(phones.filter((_, i) => i !== index));
        try {
            await axios.delete(`/api/Contact/Phone/${phoneToDelete.id}`);
        } catch (error) {
            console.error('Error deleting phone:', error);
        }
    };

    const handleSubmit = async () => {
        if (!name || !surname || !address) {
            alert("Molimo popunite sva potrebna polja.");
            return;
        }

        try {
            const contactPayload = {
                id: Number(contactId), // Ensure contactId is a number
                name,
                surname,
                address
            };

            console.log('Contact Payload:', contactPayload);

            await axios.put(`/api/Contact/${contactId}`, contactPayload);

            const emailPromises = emails
                .filter(email => email.emailAddress.trim() !== '') // Filter out empty email addresses
                .map(email => {
                    const emailPayload = {
                        id: email.id,
                        contactId: Number(contactId), // Ensure contactId is a number
                        emailAddress: email.emailAddress,
                        category: email.category
                    };

                    console.log('Email Payload:', emailPayload);
                    if (email.id < 0) {
                        // New email, use POST
                        return axios.post(`/api/Contact/Email`, emailPayload);
                    } else {
                        // Existing email, use PUT
                        return axios.put(`/api/Contact/Email/${email.id}`, emailPayload);
                    }
                });

            const phonePromises = phones
                .filter(phone => phone.phoneNumber.trim() !== '') // Filter out empty phone numbers
                .map(phone => {
                    const phonePayload = {
                        id: phone.id,
                        contactId: Number(contactId), // Ensure contactId is a number
                        phoneNumber: phone.phoneNumber,
                        category: phone.category
                    };

                    console.log('Phone Payload:', phonePayload);
                    if (phone.id < 0) {
                        // New phone, use POST
                        return axios.post(`/api/Contact/Phone`, phonePayload);
                    } else {
                        // Existing phone, use PUT
                        return axios.put(`/api/Contact/Phone/${phone.id}`, phonePayload);
                    }
                });

            await Promise.all([...emailPromises, ...phonePromises]);

            handleDismissPanel();
        } catch (err) {
            const error = err as any;
            console.error('Error updating contact:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
        window.location.reload();
    };

    return (
        <div>
            <Panel isOpen={isOpen} onDismiss={handleDismissPanel} headerText="Uredi kontakt"
                styles={{ headerText: { fontSize: '40px', fontWeight: 'bold' } }} closeButtonAriaLabel='Zatvori'
                isFooterAtBottom={true} isLightDismiss={true} type={PanelType.customNear} customWidth="600px" isBlocking={true}
                headerClassName="panel-header">
                <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: '20px' } }}>
                    <TextField label="Ime" value={name} onChange={(e, newValue) => setName(newValue || '')} />
                    <TextField label="Prezime" value={surname} onChange={(e, newValue) => setSurname(newValue || '')} />
                    <TextField label="Adresa" value={address} onChange={(e, newValue) => setAddress(newValue || '')} />
                    {emails.map((email, index) => (
                        <Stack key={email.id} horizontal tokens={{ childrenGap: 10 }}>
                            <TextField
                                placeholder="Email"
                                value={email.emailAddress}
                                onChange={(e, newValue) => handleEmailChange(index, newValue || '')}
                                styles={{ root: { flexGrow: 1 } }}
                            />
                            <Dropdown
                                placeholder="Odaberite kategoriju"
                                options={[...categories.map(category => ({ key: category, text: category })), { key: 'add_new_category', text: 'Dodaj novu kategoriju...' }]}
                                selectedKey={email.category}
                                onChange={(e, option) => handleCategoryChange(index, option?.key as string, 'email')}
                                styles={{ dropdown: { flexGrow: 1 } }}
                            />
                            <PrimaryButton text="Obriši" onClick={() => handleDeleteEmail(index)} styles={{ root: { flexGrow: 0 } }} />
                        </Stack>
                    ))}
                    <PrimaryButton text="Dodaj email" onClick={handleAddEmail} styles={{ root: { width: '100%' } }} />
                    {phones.map((phone, index) => (
                        <Stack key={phone.id} horizontal tokens={{ childrenGap: 10 }}>
                            <TextField
                                placeholder="Telefon"
                                value={phone.phoneNumber}
                                onChange={(e, newValue) => handlePhoneChange(index, newValue || '')}
                                styles={{ root: { flexGrow: 1 } }}
                            />
                            <Dropdown
                                placeholder="Odaberite kategoriju"
                                options={[...categories.map(category => ({ key: category, text: category })), { key: 'add_new_category', text: 'Dodaj novu kategoriju...' }]}
                                selectedKey={phone.category}
                                onChange={(e, option) => handleCategoryChange(index, option?.key as string, 'phone')}
                                styles={{ dropdown: { flexGrow: 1 } }}
                            />
                            <PrimaryButton text="Obriši" onClick={() => handleDeletePhone(index)} styles={{ root: { flexGrow: 0 } }} />
                        </Stack>
                    ))}
                    <PrimaryButton text="Dodaj telefon" onClick={handleAddPhone} styles={{ root: { width: '100%' } }} />
                    <PrimaryButton text="Spremi" onClick={handleSubmit} styles={{ root: { width: '100%' } }} />
                </Stack>
            </Panel>
            <Dialog
                hidden={!isAddCategoryDialogVisible}
                onDismiss={hideAddCategoryDialog}
                dialogContentProps={{ type: DialogType.normal, title: 'Dodaj novu kategoriju' }}
                modalProps={{ isBlocking: true }}
            >
                <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: '20px' } }}>
                    <TextField
                        label="Nova kategorija"
                        value={newCategory}
                        onChange={(e, newValue) => setNewCategory(newValue || '')}
                        placeholder="Unesi novu kategoriju"
                    />
                    <PrimaryButton text="Dodaj kategoriju" onClick={handleAddCategory} styles={{ root: { width: '100%' } }} />
                </Stack>
            </Dialog>
        </div>
    );
};

export default EditContact;