import React, { useState } from "react";

import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert
} from "react-native";

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import AsyncStorage from "@react-native-async-storage/async-storage";

import uuid from 'react-native-uuid';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form'
import { useAuth } from "../../hooks/auth";

import { InputForm } from "../../components/Form/InputFormController";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from '../CategorySelect'

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from "./style";

interface FormData {
    name: string
    amount: string
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigátorio'),
    amount: Yup.number()
            .typeError('Informe um valor númerico')
            .positive('O valor não pode ser negativo')
            .required('Preço é obrigátorio')
})

export function Register() {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setcategoryModalOpen] = useState(false);

    const { user } = useAuth()

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const navigation = useNavigation();

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset 
    } = useForm({

        resolver: yupResolver(schema)
    })

    function handleTransactionTypes(type: 'positive' | 'negative') {
        setTransactionType(type)
    }

    function handleOpenSelectCategory() {
        setcategoryModalOpen(true)
    }

    function handleCloseSelectCategory() {
        setcategoryModalOpen(false)
    }

    async function handleRegister(form: FormData) {
        if(!transactionType) return Alert.alert('Selecione o tipo da transação!')
        
        if(category.key === 'category') return Alert.alert('Selecione a categoria!')
        
        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name, 
            amount: form.amount, 
            type: transactionType, 
            category: category.key,
            date: new Date()
        }
        
        try {
            const dataKey = `@gofinances:transactions_user:${user.id}`;
            
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                
                    ...currentData,
                    newTransaction
                
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem')

        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possivel salvar")
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                    <Header>
                        <Title>Cadastro</Title>
                    </Header>

                    <Form>
                        <Fields>
                            <InputForm 
                                name="name" 
                                control={control} 
                                placeholder="Nome"
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                autoFocus={true}
                                error={errors.name && errors.name.message}
                            />
                            
                            <InputForm
                                name="amount" 
                                control={control} 
                                placeholder="Preço"
                                keyboardType="numeric"
                                error={errors.amount && errors.amount.message}
                            />

                            <TransactionTypes>
                                <TransactionTypeButton
                                    type="up"
                                    title="Receita"
                                    onPress={() => handleTransactionTypes('positive')}
                                    isActive={transactionType === 'positive'}
                                />
                                <TransactionTypeButton
                                    type="down"
                                    title="Gasto"
                                    onPress={() => handleTransactionTypes('negative')}
                                    isActive={transactionType === 'negative'}
                                />
                            </TransactionTypes>
                            <CategorySelectButton 
                                title={category.name}
                                onPress={handleOpenSelectCategory} 
                            />
                        </Fields>
                        
                        <Button title='Enviar' onPress={handleSubmit(handleRegister)}/>
                    
                    </Form>

                    <Modal visible={categoryModalOpen}>
                        <CategorySelect 
                            category={category}
                            setCategory={setCategory}
                            closeSelectCategory={handleCloseSelectCategory}
                        />
                    </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}