import styled, { css } from 'styled-components';
import logo from '../assets/Logo2.jpg';

const Logo = styled.img`
  ${({ theme: { breakpoints } }) => css`
    width: 100px;
    ${breakpoints.up('md')} {
      width: 200px;
    }
  `}
`;

Logo.defaultProps = {
  src: logo,
  alt: 'NASA Logo'
};

export default Logo;