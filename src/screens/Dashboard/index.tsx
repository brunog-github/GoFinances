import React, { useState, useEffect, useCallback } from "react";

import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from "styled-components";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { 
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from './style'

export interface DataListProps extends TransactionCardProps{
  id: string
}

interface HighlightProps {
  amount: string
  lastTransaction: string
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}



export function Dashboard() {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

  const theme = useTheme()

  function getLastTransactionData(collection: DataListProps[], type: 'positive' | 'negative') {
    
    const lastTransaction = 
    new Date(
      Math.max.apply(Math, collection
        .filter(transaction => transaction.type === 'positive')
        .map(transaction => new Date(transaction.date).getTime())
      )
    );
  
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
  }

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if(item.type === 'positive'){
          entriesTotal += Number(item.amount)
        }else{
          expensiveTotal += Number(item.amount)
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date))

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      });

      setData(transactionsFormatted)

      const lastTransactionEntries = getLastTransactionData(transactions, 'positive')
      const lastTransactionExpensives = getLastTransactionData(transactions, 'negative')
      const totalInterval = `01 a ${lastTransactionExpensives}`

      const total = entriesTotal - expensiveTotal

      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: `Última entrada do dia ${lastTransactionEntries}`
        },
        expensives: {
          amount: expensiveTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: `Última entrada do dia ${lastTransactionExpensives}`
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: totalInterval
        }
      })
      setLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))
  
  return (
    <Container>
      {
        isLoading? 
        <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.secondary}
              size='large'
            />
          </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: "https://avatars.githubusercontent.com/u/87875400?v=4"}}/>
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Bruno</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power"/>
              </LogoutButton>

            </UserWrapper> 
          </Header>
          
          <HighlightCards>
            <HighlightCard 
              type='up'
              title='Entradas' 
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard 
              type='down'
              title='Saídas' 
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
            />
            <HighlightCard
              type='total'
              title='Total' 
              amount={highlightData.total.amount} 
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>
          
          <Transactions>
            <Title>Listagem</Title>
            
            <TransactionsList
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item}) => <TransactionCard data = {item}/>}
            />
            
            
          </Transactions>
        </>
      }
    </Container>
  )
}
  