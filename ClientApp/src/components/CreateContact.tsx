import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, TextField, Stack, Dropdown, PrimaryButton, Panel, PanelType, Dialog, DialogType, IconButton } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { useBoolean } from '@fluentui/react-hooks';
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

interface Category {
    id: number;
    categoryName: string;
}

interface CreateContactProps {
    isOpen: boolean;
    contactId: string;
    onDismiss: () => void;
}

const CreateContact: React.FC<CreateContactProps> = ({ isOpen, contactId, onDismiss }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [address, setAddress] = useState('');
    const [emails, setEmails] = useState<Email[]>([]);
    const [phones, setPhones] = useState<Phone[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [isAddCategoryDialogVisible, { setTrue: showAddCategoryDialog, setFalse: hideAddCategoryDialog }] = useBoolean(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/Contact/Categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleDismissPanel = () => {
        onDismiss();
        navigate('/');
    };

    const handleAddEmail = () => {
        setEmails([...emails, { id: Date.now(), contactId: 0, emailAddress: '', category: '' }]);
    };

    const handleAddPhone = () => {
        setPhones([...phones, { id: Date.now(), contactId: 0, phoneNumber: '', category: '' }]);
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

    const handleAddCategory = async () => {
        if (newCategory && !categories.some(category => category.categoryName === newCategory)) {
            try {
                const response = await axios.post('/api/Contact/Category', { categoryName: newCategory });
                setCategories([...categories, response.data]);
                setNewCategory('');
                hideAddCategoryDialog();
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }
    };

    const handleDeleteEmail = (index: number) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails);
    };

    const handleDeletePhone = (index: number) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones);
    };

    const handleSubmit = async () => {
        if (!name || !surname || !address) {
            alert("Molimo unesite ime, prezime i adresu kontakta.");
            return;
        }

        try {
            const contactPayload = {
                name,
                surname,
                address
            };

            console.log('Contact Payload:', contactPayload);

            const contactResponse = await axios.post('/api/Contact', contactPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const contactId = contactResponse.data.id;
            console.log('Created Contact ID:', contactId);

            const emailPromises = emails.map(email => {
                const emailPayload = {
                    contactId,
                    emailAddress: email.emailAddress,
                    category: email.category
                };

                console.log('Email Payload:', emailPayload);
                return axios.post('/api/Contact/Email', emailPayload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            });

            const phonePromises = phones.map(phone => {
                const phonePayload = {
                    contactId,
                    phoneNumber: phone.phoneNumber,
                    category: phone.category
                };

                console.log('Phone Payload:', phonePayload);
                return axios.post('/api/Contact/Phone', phonePayload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            });

            await Promise.all([...emailPromises, ...phonePromises]);

            handleDismissPanel();
        } catch (err) {
            const error = err as any;
            console.error('Error creating contact:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
        window.location.reload();
    };

    const categoryOptions = categories.map(category => ({
        key: category.categoryName,
        text: category.categoryName
    }));

    return (
        <div>
            <Panel isOpen={isOpen} onDismiss={handleDismissPanel} headerText="Dodaj novi kontakt"
                styles={{ headerText: { fontSize: '40px', fontWeight: 'bold' } }} closeButtonAriaLabel='Zatvori'
                isFooterAtBottom={true} isLightDismiss={true} type={PanelType.customNear} customWidth="600px" isBlocking={false}>
                <Stack tokens={{ childrenGap: 15 }}>
                    <TextField label="Ime" value={name} onChange={(e, newValue) => setName(newValue || '')} />
                    <TextField label="Prezime" value={surname} onChange={(e, newValue) => setSurname(newValue || '')} />
                    <TextField label="Adresa" value={address} onChange={(e, newValue) => setAddress(newValue || '')} />
                    <Text variant="large">Email adrese:</Text>
                    {emails.map((email, index) => (
                        <Stack key={email.id} tokens={{ childrenGap: 10 }} horizontal verticalAlign="center">
                            <TextField
                                value={email.emailAddress}
                                onChange={(e, newValue) => handleEmailChange(index, newValue || '')}
                                placeholder="Email adresa"
                                styles={{ root: { width: '400px' } }}
                            />
                            <Dropdown
                                placeholder="Odaberite kategoriju"
                                options={[...categoryOptions, { key: 'add_new_category', text: 'Dodaj novu kategoriju...' }]}
                                selectedKey={email.category}
                                onChange={(e, option) => handleCategoryChange(index, option?.key as string, 'email')}
                                styles={{ dropdown: { width: '200px' } }}
                            />
                            <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => handleDeleteEmail(index)} />
                        </Stack>
                    ))}
                    <PrimaryButton text="Dodaj email" onClick={handleAddEmail} />
                    <Text variant="large">Brojevi telefona:</Text>
                    {phones.map((phone, index) => (
                        <Stack key={phone.id} tokens={{ childrenGap: 10 }} horizontal verticalAlign="center">
                            <TextField
                                value={phone.phoneNumber}
                                onChange={(e, newValue) => handlePhoneChange(index, newValue || '')}
                                placeholder="Broj telefona"
                                styles={{ root: { width: '400px' } }}
                            />
                            <Dropdown
                                placeholder="Odaberite kategoriju"
                                options={[...categoryOptions, { key: 'add_new_category', text: 'Dodaj novu kategoriju...' }]}
                                selectedKey={phone.category}
                                onChange={(e, option) => handleCategoryChange(index, option?.key as string, 'phone')}
                                styles={{ dropdown: { width: '200px' } }}
                            />
                            <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => handleDeletePhone(index)} />
                        </Stack>
                    ))}
                    <PrimaryButton text="Dodaj telefon" onClick={handleAddPhone} />
                    <PrimaryButton text="Spremi" onClick={handleSubmit} />
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
                    <PrimaryButton text="Dodaj kategoriju" onClick={handleAddCategory} />
                </Stack>
            </Dialog>
        </div>
    );
};

export default CreateContact;