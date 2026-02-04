#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8787}"
API_URL="${API_BASE_URL%/}/api"

if [[ -z "${CLERK_JWT:-}" ]]; then
  echo "Missing CLERK_JWT. Export a valid Clerk JWT for the test user."
  exit 1
fi

log() {
  printf "\n==> %s\n" "$1"
}

request() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  local response

  if [[ -n "$data" ]]; then
    response=$(curl -sS -X "$method" "$url" \
      -H "Authorization: Bearer ${CLERK_JWT}" \
      -H "Content-Type: application/json" \
      -d "$data" \
      -w "\n%{http_code}")
  else
    response=$(curl -sS -X "$method" "$url" \
      -H "Authorization: Bearer ${CLERK_JWT}" \
      -w "\n%{http_code}")
  fi

  local status="${response##*$'\n'}"
  local body="${response%$'\n'*}"
  printf "%s\n%s" "$status" "$body"
}

expect_status() {
  local expected="$1"
  local actual="$2"
  if [[ "$actual" != "$expected" ]]; then
    echo "Expected HTTP $expected, got $actual"
    return 1
  fi
}

json_field() {
  local field="$1"
  python3 -c "import json,sys; data=json.load(sys.stdin); print(data.get('$field',''))"
}

log "Health check"
health_response=$(request GET "${API_BASE_URL%/}/health")
health_status=$(printf "%s" "$health_response" | head -n1)
health_body=$(printf "%s" "$health_response" | tail -n1)
expect_status 200 "$health_status"
echo "Health: $health_body"

log "Create card 1"
card1_payload='{"name":"E2E Visa","issuer":"Test","creditLimitCents":500000,"currentBalanceCents":120000,"minimumPaymentCents":2500,"aprBps":1999,"statementCloseDay":20,"dueDateDay":5,"excludeFromOptimization":false}'
card1_response=$(request POST "${API_URL}/cards" "$card1_payload")
card1_status=$(printf "%s" "$card1_response" | head -n1)
card1_body=$(printf "%s" "$card1_response" | tail -n1)
expect_status 201 "$card1_status"
card1_id=$(printf "%s" "$card1_body" | json_field "id")

log "Create card 2"
card2_payload='{"name":"E2E MasterCard","issuer":"Test","creditLimitCents":300000,"currentBalanceCents":80000,"minimumPaymentCents":1800,"aprBps":2399,"statementCloseDay":15,"dueDateDay":1,"excludeFromOptimization":false}'
card2_response=$(request POST "${API_URL}/cards" "$card2_payload")
card2_status=$(printf "%s" "$card2_response" | head -n1)
card2_body=$(printf "%s" "$card2_response" | tail -n1)
expect_status 201 "$card2_status"
card2_id=$(printf "%s" "$card2_body" | json_field "id")

log "List cards"
list_response=$(request GET "${API_URL}/cards")
list_status=$(printf "%s" "$list_response" | head -n1)
list_body=$(printf "%s" "$list_response" | tail -n1)
expect_status 200 "$list_status"
echo "Cards: $list_body"

log "Generate plan"
plan_payload='{"availableCashCents":60000,"strategy":"utilization"}'
plan_response=$(request POST "${API_URL}/plan/generate" "$plan_payload")
plan_status=$(printf "%s" "$plan_response" | head -n1)
plan_body=$(printf "%s" "$plan_response" | tail -n1)
expect_status 200 "$plan_status"
plan_id=$(printf "%s" "$plan_body" | json_field "id")
echo "Generated plan id: ${plan_id}"

log "Fetch current plan"
current_response=$(request GET "${API_URL}/plan/current")
current_status=$(printf "%s" "$current_response" | head -n1)
current_body=$(printf "%s" "$current_response" | tail -n1)
expect_status 200 "$current_status"
current_id=$(printf "%s" "$current_body" | json_field "id")
echo "Current plan id: ${current_id}"

log "Apply override"
override_payload=$(printf '{"cardId":"%s","updates":{"currentBalanceCents":110000}}' "$card1_id")
override_response=$(request POST "${API_URL}/overrides" "$override_payload")
override_status=$(printf "%s" "$override_response" | head -n1)
override_body=$(printf "%s" "$override_response" | tail -n1)
expect_status 200 "$override_status"

log "Mark first action paid"
mark_response=$(request POST "${API_URL}/plan/actions/0/mark-paid")
mark_status=$(printf "%s" "$mark_response" | head -n1)
mark_body=$(printf "%s" "$mark_response" | tail -n1)
expect_status 200 "$mark_status"

log "Cleanup cards"
request DELETE "${API_URL}/cards/${card1_id}" >/dev/null
request DELETE "${API_URL}/cards/${card2_id}" >/dev/null

log "E2E API validation complete"
