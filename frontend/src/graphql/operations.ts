import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      access_token
      user {
        id
        email
        name
        role
        country {
          id
          name
        }
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!, $countryId: String!) {
    signup(input: { email: $email, password: $password, name: $name, countryId: $countryId, role: "USER" }) {
      access_token
      user {
        id
        name
        country {
          id
          name
        }
      }
    }
  }
`;

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      id
      name
      code
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      imageUrl
      country {
        id
        name
      }
    }
  }
`;

export const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: String!) {
    menuItems(restaurantId: $restaurantId) {
      id
      name
      description
      price
      category
      imageUrl
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($restaurantId: String!, $items: [OrderItemInput!]!) {
    createOrder(input: { restaurantId: $restaurantId, items: $items }) {
      id
      status
      total
      createdAt
    }
  }
`;

export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      status
      total
      createdAt
      restaurant {
        name
      }
      items {
        menuItem {
          name
        }
        quantity
        price
      }
    }
  }
`;

export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($orderId: String!) {
    checkoutOrder(orderId: $orderId) {
      id
      status
      paidAt
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

export const MY_PAYMENT_METHODS = gql`
  query MyPaymentMethods {
    myPaymentMethods {
      id
      type
      lastFour
      isDefault
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($type: String!, $lastFour: String!, $isDefault: Boolean!) {
    addPaymentMethod(input: { type: $type, lastFour: $lastFour, isDefault: $isDefault }) {
      id
      type
      lastFour
    }
  }
`;
