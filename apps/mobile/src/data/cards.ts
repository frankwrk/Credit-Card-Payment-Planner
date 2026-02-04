import { CardInput, StoredCard } from "@ccpp/shared/mobile";
import { apiRequest } from "./api";

export async function listCards(token: string): Promise<StoredCard[]> {
  const cards = await apiRequest<StoredCard[]>("/cards", token);
  return cards.map((card) => StoredCard.parse(card));
}

export async function getCard(
  token: string,
  cardId: string
): Promise<StoredCard | null> {
  const cards = await listCards(token);
  return cards.find((card) => card.id === cardId) ?? null;
}

export async function createCard(
  token: string,
  input: CardInput
): Promise<StoredCard> {
  const parsed = CardInput.parse(input);
  const card = await apiRequest<StoredCard>("/cards", token, {
    method: "POST",
    body: JSON.stringify(parsed),
  });
  return StoredCard.parse(card);
}

export async function updateCard(
  token: string,
  cardId: string,
  input: CardInput
): Promise<StoredCard> {
  const parsed = CardInput.parse(input);
  const card = await apiRequest<StoredCard>(`/cards/${cardId}`, token, {
    method: "PATCH",
    body: JSON.stringify(parsed),
  });
  return StoredCard.parse(card);
}

export async function deleteCard(token: string, cardId: string): Promise<void> {
  await apiRequest(`/cards/${cardId}`, token, { method: "DELETE" });
}
