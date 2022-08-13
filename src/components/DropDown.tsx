import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

const DropDownContainer = styled.div`
  position: relative;
  display: inline-block;
`;
const DropDownHeader = styled.div`
  cursor: pointer;
`;

const DropDownListContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
  background-color: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.lightGray};
  border-radius: 5px;
`;

export const DropDownListPayload = styled.div`
  white-space: nowrap;
`;

export const ListItem = styled.div`
  cursor: pointer;
  padding: 10px 20px;

  &:hover {
    background: ${(props) => props.theme.lightGray};
  }
`;

function useOutsideAlerter(ref: React.RefObject<Node>, onClick: () => void) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClick]);
}

const Container: FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, onClose);
  return (
    <DropDownListContainer ref={wrapperRef}>{children}</DropDownListContainer>
  );
};

export interface DropDownProps extends PropsWithChildren {
  payload: (onClose: () => void) => React.ReactNode;
}

export const DropDown = ({ children, payload }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => {
    setIsOpen((value) => !value);
  };

  return (
    <DropDownContainer>
      <DropDownHeader onClick={toggling}>{children}</DropDownHeader>
      {isOpen && <Container onClose={toggling}>{payload(toggling)}</Container>}
    </DropDownContainer>
  );
};

export interface DropDownListProps<T> extends PropsWithChildren {
  options: T[];
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
}

export const DropDownList = <T extends any>({
  children,
  options,
  renderOption,
  onSelect,
}: DropDownListProps<T>) => {
  return (
    <DropDown
      payload={(onClose) => (
        <DropDownListPayload>
          {options.map((option, index) => (
            <ListItem
              key={index}
              onClick={() => {
                onClose();
                onSelect(option);
              }}
            >
              {renderOption(option)}
            </ListItem>
          ))}
        </DropDownListPayload>
      )}
    >
      {children}
    </DropDown>
  );
};
