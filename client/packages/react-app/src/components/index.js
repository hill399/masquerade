import styled from "styled-components";

export const Header = styled.header`
  background-color: #000000;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
  min-width: 900px;
`;

export const Input = styled.input`
  background-color: #000000;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

export const Body = styled.body`
  align-items: center;
  background-color: #000000;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  min-height: calc(100vh - 70px);
  min-width: 900px;
  height: 100%
`;

export const Image = styled.img`
  height: 40vmin;
  margin-bottom: 16px;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`;

export const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 8px;
  text-align: center;
  text-decoration: none;
  margin: 0px 20px;
  padding: 12px 24px;
  display: inline-block;
  position: absolute;

  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
`;
