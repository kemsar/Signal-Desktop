import * as React from 'react';
import { SearchResults } from './SearchResults';
import {
  MessageSearchResult,
  PropsDataType as MessageSearchResultPropsType,
} from './MessageSearchResult';

// @ts-ignore
import { setup as setupI18n } from '../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../_locales/en/messages.json';

import { storiesOf } from '@storybook/react';
//import { boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

// @ts-ignore
import gif from '../../fixtures/giphy-GVNvOUpeYmI7e.gif';
// @ts-ignore
import png from '../../fixtures/freepngs-2cd43b_bed7d1327e88454487397574d87b64dc_mv2.png';
// @ts-ignore
import landscapeGreen from '../../fixtures/1000x50-green.jpeg';
// @ts-ignore
import landscapePurple from '../../fixtures/200x50-purple.png';

const i18n = setupI18n('en', enMessages);

function makeObjectUrl(data: ArrayBuffer, contentType: string): string {
  const blob = new Blob([data], {
    type: contentType,
  });

  return URL.createObjectURL(blob);
}

// 320x240
const gifObjectUrl = makeObjectUrl(gif, 'image/gif');
// 800×1200
const pngObjectUrl = makeObjectUrl(png, 'image/png');
const landscapeGreenObjectUrl = makeObjectUrl(landscapeGreen, 'image/jpeg');
const landscapePurpleObjectUrl = makeObjectUrl(landscapePurple, 'image/png');

const messageLookup: Map<string, MessageSearchResultPropsType> = new Map();

const CONTACT = 'contact' as 'contact';
const CONTACTS_HEADER = 'contacts-header' as 'contacts-header';
const CONVERSATION = 'conversation' as 'conversation';
const CONVERSATIONS_HEADER = 'conversations-header' as 'conversations-header';
const DIRECT = 'direct' as 'direct';
const GROUP = 'group' as 'group';
const MESSAGE = 'message' as 'message';
const MESSAGES_HEADER = 'messages-header' as 'messages-header';
const SENT = 'sent' as 'sent';
const START_NEW_CONVERSATION = 'start-new-conversation' as 'start-new-conversation';
const SMS_MMS_NOT_SUPPORTED = 'sms-mms-not-supported-text' as 'sms-mms-not-supported-text';

// tslint:disable-next-line no-backbone-get-set-outside-model
messageLookup.set('1-guid-guid-guid-guid-guid', {
  id: '1-guid-guid-guid-guid-guid',
  conversationId: '(202) 555-0015',
  sentAt: Date.now() - 5 * 60 * 1000,
  snippet: '<<left>>Everyone<<right>>! Get in!',

  from: {
    phoneNumber: '(202) 555-0020',
    isMe: true,
    avatarPath: gifObjectUrl,
  },
  to: {
    phoneNumber: '(202) 555-0015',
    name: 'Mr. Fire 🔥',
  },
});

// tslint:disable-next-line no-backbone-get-set-outside-model
messageLookup.set('2-guid-guid-guid-guid-guid', {
  id: '2-guid-guid-guid-guid-guid',
  conversationId: '(202) 555-0016',
  sentAt: Date.now() - 20 * 60 * 1000,
  snippet: 'Why is <<left>>everyone<<right>> so frustrated?',
  from: {
    phoneNumber: '(202) 555-0016',
    name: 'Jon ❄️',
    color: 'green',
  },
  to: {
    phoneNumber: '(202) 555-0020',
    isMe: true,
  },
});

// tslint:disable-next-line no-backbone-get-set-outside-model
messageLookup.set('3-guid-guid-guid-guid-guid', {
  id: '3-guid-guid-guid-guid-guid',
  conversationId: 'EveryoneGroupID',
  sentAt: Date.now() - 24 * 60 * 1000,
  snippet: 'Hello, <<left>>everyone<<right>>! Woohooo!',
  from: {
    phoneNumber: '(202) 555-0011',
    name: 'Someone',
    color: 'green',
    avatarPath: pngObjectUrl,
  },
  to: {
    phoneNumber: '(202) 555-0016',
    name: "Y'all 🌆",
  },
});

// tslint:disable-next-line no-backbone-get-set-outside-model
messageLookup.set('4-guid-guid-guid-guid-guid', {
  id: '4-guid-guid-guid-guid-guid',
  conversationId: 'EveryoneGroupID',
  sentAt: Date.now() - 24 * 60 * 1000,
  snippet: 'Well, <<left>>everyone<<right>>, happy new year!',
  from: {
    phoneNumber: '(202) 555-0020',
    isMe: true,
    avatarPath: gifObjectUrl,
  },
  to: {
    phoneNumber: '(202) 555-0016',
    name: "Y'all 🌆",
  },
});

const defaultProps = {
  discussionsLoading: false,
  height: 700,
  items: [],
  i18n,
  messagesLoading: false,
  noResults: false,
  openConversationInternal: action('open-conversation-internal'),
  regionCode: 'US',
  renderMessageSearchResult(id: string): JSX.Element {
    const messageProps = messageLookup.get(id) as MessageSearchResultPropsType;

    return (
      <MessageSearchResult
        {...messageProps}
        i18n={i18n}
        openConversationInternal={action(
          'MessageSearchResult-open-conversation-internal'
        )}
      />
    );
  },
  searchConversationName: undefined,
  searchTerm: '1234567890',
  selectedConversationId: undefined,
  selectedMessageId: undefined,
  startNewConversation: action('start-new-conversation'),
  width: 320,
};

const conversations = [
  {
    type: CONVERSATION,
    data: {
      id: '+12025550011',
      phoneNumber: '(202) 555-0011',
      name: 'Everyone 🌆',
      type: GROUP,
      avatarPath: landscapeGreenObjectUrl,
      isMe: false,
      lastUpdated: Date.now() - 5 * 60 * 1000,
      unreadCount: 0,
      isSelected: false,
      lastMessage: {
        text: 'The rabbit hopped silently in the night.',
        status: SENT,
      },
    },
  },
  {
    type: CONVERSATION,
    data: {
      id: '+12025550012',
      phoneNumber: '(202) 555-0012',
      name: 'Everyone Else 🔥',
      type: DIRECT,
      avatarPath: landscapePurpleObjectUrl,
      isMe: false,
      lastUpdated: Date.now() - 5 * 60 * 1000,
      unreadCount: 0,
      isSelected: false,
      lastMessage: {
        text: "What's going on?",
        status: SENT,
      },
    },
  },
];

const contacts = [
  {
    type: CONTACT,
    data: {
      id: '+12025550013',
      phoneNumber: '(202) 555-0013',
      name: 'The one Everyone',
      type: DIRECT,
      avatarPath: gifObjectUrl,
      isMe: false,
      lastUpdated: Date.now() - 10 * 60 * 1000,
      unreadCount: 0,
      isSelected: false,
    },
  },
  {
    type: CONTACT,
    data: {
      id: '+12025550014',
      phoneNumber: '(202) 555-0014',
      name: 'No likey everyone',
      type: DIRECT,
      color: 'red',
      isMe: false,
      lastUpdated: Date.now() - 11 * 60 * 1000,
      unreadCount: 0,
      isSelected: false,
    },
  },
];

const messages = [
  {
    type: MESSAGE,
    data: '1-guid-guid-guid-guid-guid',
  },
  {
    type: MESSAGE,
    data: '2-guid-guid-guid-guid-guid',
  },
  {
    type: MESSAGE,
    data: '3-guid-guid-guid-guid-guid',
  },
  {
    type: MESSAGE,
    data: '4-guid-guid-guid-guid-guid',
  },
];

const messagesMany = Array.from(Array(100), (_, i) => messages[i % 4]);

const permutations = [
  {
    title: 'SMS/MMS Not Supported Text',
    props: {
      items: [
        {
          type: START_NEW_CONVERSATION,
          data: undefined,
        },
        {
          type: SMS_MMS_NOT_SUPPORTED,
          data: undefined,
        },
      ],
    },
  },
  {
    title: 'All Result Types',
    props: {
      items: [
        {
          type: CONVERSATIONS_HEADER,
          data: undefined,
        },
        ...conversations,
        {
          type: CONTACTS_HEADER,
          data: undefined,
        },
        ...contacts,
        {
          type: MESSAGES_HEADER,
          data: undefined,
        },
        ...messages,
      ],
    },
  },
  {
    title: 'Start new Conversation',
    props: {
      items: [
        {
          type: START_NEW_CONVERSATION,
          data: undefined,
        },
        {
          type: CONVERSATIONS_HEADER,
          data: undefined,
        },
        ...conversations,
        {
          type: CONTACTS_HEADER,
          data: undefined,
        },
        ...contacts,
        {
          type: MESSAGES_HEADER,
          data: undefined,
        },
        ...messages,
      ],
    },
  },
  {
    title: 'No Conversations',
    props: {
      items: [
        {
          type: CONTACTS_HEADER,
          data: undefined,
        },
        ...contacts,
        {
          type: MESSAGES_HEADER,
          data: undefined,
        },
        ...messages,
      ],
    },
  },
  {
    title: 'No Contacts',
    props: {
      items: [
        {
          type: CONVERSATIONS_HEADER,
          data: undefined,
        },
        ...conversations,
        {
          type: MESSAGES_HEADER,
          data: undefined,
        },
        ...messages,
      ],
    },
  },
  {
    title: 'No Messages',
    props: {
      items: [
        {
          type: CONVERSATIONS_HEADER,
          data: undefined,
        },
        ...conversations,
        {
          type: CONTACTS_HEADER,
          data: undefined,
        },
        ...contacts,
      ],
    },
  },
  {
    title: 'No Results',
    props: {
      noResults: true,
    },
  },
  {
    title: 'No Results, Searching in Conversation',
    props: {
      noResults: true,
      searchInConversationName: 'Everyone 🔥',
      searchTerm: 'something',
    },
  },
  {
    title: 'Searching in Conversation no search term',
    props: {
      noResults: true,
      searchInConversationName: 'Everyone 🔥',
      searchTerm: '',
    },
  },
  {
    title: 'Lots of results',
    props: {
      items: [
        {
          type: CONVERSATIONS_HEADER,
          data: undefined,
        },
        ...conversations,
        {
          type: CONTACTS_HEADER,
          data: undefined,
        },
        ...contacts,
        {
          type: MESSAGES_HEADER,
          data: undefined,
        },
        ...messagesMany,
      ],
    },
  },
  {
    title: 'Messages, no header',
    props: {
      items: messages,
    },
  },
];

storiesOf('Components/SearchResults', module).add('Iterations', (): any => {
  return permutations.map(({ props, title }) => (
    <>
      <h3>{title}</h3>
      <div className="module-left-pane">
        <SearchResults {...defaultProps} {...props} />
      </div>
      <hr />
    </>
  ));
});
