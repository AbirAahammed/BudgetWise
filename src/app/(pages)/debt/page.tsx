'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { OpenAPI, CardControllerService, CardHistoryControllerService, type Card, type CardBalanceHistoryResponse } from '@/api';
import { Card as CardComponent, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { AddCardDialog } from '@/components/debt/add-card-dialog';
import { EditCardDialog } from '@/components/debt/edit-card-dialog';

// Set the API base URL
OpenAPI.BASE = process.env.PERFIN_SERVICE_URL || 'http://localhost:8080';

export default function DebtPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<{ [cardId: number]: CardBalanceHistoryResponse[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEditCard, setSelectedEditCard] = useState<Card | null>(null);
  const { toast } = useToast();

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      const cardsData = await CardControllerService.card();
      setCards(cardsData);
      
      // Set the first card as selected
      if (cardsData.length > 0) {
        setSelectedCardId(cardsData[0].id!);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch cards. Make sure the external API is running on port 8080.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Fetch history when selected card changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedCardId) return;
      
      try {
        const historyData = await CardHistoryControllerService.getAllCardHistories(selectedCardId);
        setHistory(prev => ({
          ...prev,
          [selectedCardId]: historyData,
        }));
      } catch (error) {
        console.error('Failed to fetch card history:', error);
      }
    };

    fetchHistory();
  }, [selectedCardId]);

  const handleCardAdded = (newCard: Card) => {
    // Add the new card to the list
    setCards(prev => [...prev, newCard]);
    // Select the newly added card
    setSelectedCardId(newCard.id!);
  };

  const handleRowSingleClick = (card: Card) => {
    setSelectedCardId(card.id!);
  };

  const handleRowDoubleClick = (card: Card) => {
    setSelectedEditCard(card);
    setEditDialogOpen(true);
  };

  const handleCardUpdated = (updatedCard: Card) => {
    // Update the card in the list
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    // Update selected card if it's the one being edited
    if (selectedCardId === updatedCard.id) {
      setSelectedCardId(updatedCard.id!);
    }
  };

  const handleCardDeleted = (cardId: number) => {
    // Remove the card from the list
    setCards(prev => prev.filter(c => c.id !== cardId));
    // Clear selected card if it's the one being deleted
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
      setHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[cardId];
        return newHistory;
      });
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getUtilizationRate = (card: Card) => {
    if (!card.creditLimit) return 0;
    return ((card.currentBalance || 0) / card.creditLimit) * 100;
  };

  const chartData = selectedCardId && history[selectedCardId]
    ? history[selectedCardId].map(item => ({
        date: new Date(item.recordedAt || '').toLocaleDateString(),
        balance: item.balance,
      }))
    : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Debt</h1>
            <p className="text-muted-foreground">
              Track and manage your debts and liabilities.
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debt</h1>
          <p className="text-muted-foreground">
            Track and manage your debts and liabilities.
          </p>
        </div>
        <AddCardDialog onCardAdded={handleCardAdded} />
      </div>

      {/* Cards Table */}
      <CardComponent>
        <CardHeader>
          <CardTitle>Credit Cards</CardTitle>
          <CardDescription>View all your credit cards and their balances</CardDescription>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No credit cards found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card Name</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-right">Credit Limit</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((card) => {
                    const utilization = getUtilizationRate(card);
                    const available = (card.creditLimit || 0) - (card.currentBalance || 0);
                    
                    return (
                      <TableRow
                        key={card.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => handleRowSingleClick(card)}
                        onDoubleClick={() => handleRowDoubleClick(card)}
                      >
                        <TableCell className="font-medium">{card.cardName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(card.currentBalance)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(card.creditLimit)}</TableCell>
                        <TableCell className={`text-right ${available < 0 ? 'text-destructive' : ''}`}>
                          {formatCurrency(available)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={utilization > 70 ? 'text-destructive font-semibold' : ''}>
                            {utilization.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </CardComponent>

      {/* Balance History Chart */}
      {selectedCardId && history[selectedCardId] && history[selectedCardId].length > 0 && (
        <CardComponent>
          <CardHeader>
            <CardTitle>Balance History</CardTitle>
            <CardDescription>
              Balance trend for {cards.find(c => c.id === selectedCardId)?.cardName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#ef4444" 
                    dot={false}
                    name="Balance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </CardComponent>
      )}

      {selectedCardId && (!history[selectedCardId] || history[selectedCardId].length === 0) && (
        <CardComponent>
          <CardHeader>
            <CardTitle>Balance History</CardTitle>
            <CardDescription>
              No history available for {cards.find(c => c.id === selectedCardId)?.cardName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No balance history data available</p>
            </div>
          </CardContent>
        </CardComponent>
      )}

      {/* Edit Card Dialog */}
      {selectedEditCard && (
        <EditCardDialog
          card={selectedEditCard}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onCardUpdated={handleCardUpdated}
          onCardDeleted={handleCardDeleted}
        />
      )}
    </div>
  );
}
