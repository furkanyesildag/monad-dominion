import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface FactionCreatorProps {
  onCreateFaction: (name: string, symbol: string) => void
  isCreating: boolean
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 500px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`

const Input = styled.input`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4ECDC4;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const SymbolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const SymbolOption = styled(motion.div)<{ selected: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.selected ? '#4ECDC4' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(78, 205, 196, 0.1);
  }
`

const CreateButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`

const PreviewCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const PreviewTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  opacity: 0.8;
`

const PreviewFaction = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`

const PreviewSymbol = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
`

const PreviewInfo = styled.div`
  flex: 1;
`

const PreviewName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const PreviewDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`

const symbols = ['🔥', '🌊', '🌿', '⚡', '🌟', '💎', '🗡️', '🛡️', '🏹', '🔮', '👑', '🦅', '🐺', '🐉', '🦁', '🐯', '🌙', '☀️']

export default function FactionCreator({ onCreateFaction, isCreating }: FactionCreatorProps) {
  const [factionName, setFactionName] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (factionName.trim() && selectedSymbol) {
      onCreateFaction(factionName.trim(), selectedSymbol)
    }
  }

  const isValid = factionName.trim().length >= 3 && selectedSymbol

  return (
    <Container>
      <Title>⚔️ Create Your Faction</Title>
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Faction Name</Label>
          <Input
            type="text"
            placeholder="Enter your faction name..."
            value={factionName}
            onChange={(e) => setFactionName(e.target.value)}
            maxLength={30}
            disabled={isCreating}
          />
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            {factionName.length}/30 characters (minimum 3)
          </div>
        </InputGroup>

        <InputGroup>
          <Label>Choose Symbol</Label>
          <SymbolGrid>
            {symbols.map((symbol) => (
              <SymbolOption
                key={symbol}
                selected={selectedSymbol === symbol}
                onClick={() => !isCreating && setSelectedSymbol(symbol)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {symbol}
              </SymbolOption>
            ))}
          </SymbolGrid>
        </InputGroup>

        {factionName && selectedSymbol && (
          <PreviewCard>
            <PreviewTitle>Preview:</PreviewTitle>
            <PreviewFaction>
              <PreviewSymbol>{selectedSymbol}</PreviewSymbol>
              <PreviewInfo>
                <PreviewName>{factionName}</PreviewName>
                <PreviewDescription>
                  Ready to dominate the battlefield and claim territories!
                </PreviewDescription>
              </PreviewInfo>
            </PreviewFaction>
          </PreviewCard>
        )}

        <CreateButton
          type="submit"
          disabled={!isValid || isCreating}
          whileHover={{ scale: isValid && !isCreating ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !isCreating ? 0.98 : 1 }}
        >
          {isCreating ? '🔄 Creating Faction...' : '⚔️ Create Faction & Join Battle'}
        </CreateButton>
      </Form>
    </Container>
  )
}


