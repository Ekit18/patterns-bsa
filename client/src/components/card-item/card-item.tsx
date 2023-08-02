import type { DraggableProvided } from '@hello-pangea/dnd';
import type { Card } from '../../common/types';
import { CopyButton } from '../primitives/copy-button';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Text } from '../primitives/text';
import { Title } from '../primitives/title';
import { Container } from './styled/container';
import { Content } from './styled/content';
import { Footer } from './styled/footer';
import { socket } from '../../context/socket';
import { CardEvent } from '../../common/enums';

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {
  const handleDeleteCard = () => {
    socket.emit(CardEvent.DELETE, listId, card.id);
  };

  const handleChangeTitle = (title: string) => {
    socket.emit(CardEvent.RENAME, title, listId, card.id);
  };

  const handleChangeDescription = (description: string) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, description, listId, card.id);
  };

  const handleDuplicateCard = () => {
    socket.emit(CardEvent.DUPLICATED_CARD, listId, card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={handleChangeTitle}
          title={card.name}
          fontSize="large"
          bold
        />
        <Text text={card.description} onChange={handleChangeDescription} />
        <Footer>
          <DeleteButton onClick={handleDeleteCard} />
          <Splitter />
          <CopyButton onClick={handleDuplicateCard} />
        </Footer>
      </Content>
    </Container>
  );
};
