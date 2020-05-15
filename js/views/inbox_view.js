/* global
  ConversationController,
  i18n,
  Whisper,
  Signal
*/

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};

  Whisper.StickerPackInstallFailedToast = Whisper.ToastView.extend({
    render_attributes() {
      return { toastMessage: i18n('stickers--toast--InstallFailed') };
    },
  });

  Whisper.ConversationStack = Whisper.View.extend({
    className: 'conversation-stack',
    lastConversation: null,
    open(conversation, messageId) {
      const id = `conversation-${conversation.cid}`;
      if (id !== this.el.lastChild.id) {
        const view = new Whisper.ConversationView({
          model: conversation,
          window: this.model.window,
        });
        this.listenTo(conversation, 'unload', () =>
          this.onUnload(conversation)
        );
        view.$el.appendTo(this.el);

        if (this.lastConversation && this.lastConversation !== conversation) {
          this.lastConversation.trigger(
            'unload',
            'opened another conversation'
          );
          this.stopListening(this.lastConversation);
          this.lastConversation = null;
        }

        this.lastConversation = conversation;
        conversation.trigger('opened', messageId);
      } else if (messageId) {
        conversation.trigger('scroll-to-message', messageId);
      }

      // Make sure poppers are positioned properly
      window.dispatchEvent(new Event('resize'));
    },
    onUnload(conversation) {
      if (this.lastConversation === conversation) {
        this.stopListening(this.lastConversation);
        this.lastConversation = null;
      }
    },
  });

  Whisper.AppLoadingScreen = Whisper.View.extend({
    templateName: 'app-loading-screen',
    className: 'app-loading-screen',
    updateProgress(count) {
      if (count > 0) {
        const message = i18n('loadingMessages', count.toString());
        this.$('.message').text(message);
      }
    },
    render_attributes: {
      message: i18n('loading'),
    },
  });

  Whisper.InboxView = Whisper.View.extend({
    templateName: 'two-column',
    className: 'inbox index',
    initialize(options = {}) {
      this.ready = false;
      this.render();

      this.conversation_stack = new Whisper.ConversationStack({
        el: this.$('.conversation-stack'),
        model: { window: options.window },
      });

      if (!options.initialLoadComplete) {
        this.appLoadingScreen = new Whisper.AppLoadingScreen();
        this.appLoadingScreen.render();
        this.appLoadingScreen.$el.prependTo(this.el);
        this.startConnectionListener();
      } else {
        this.setupLeftPane();
      }

      Whisper.events.on('pack-install-failed', () => {
        const toast = new Whisper.StickerPackInstallFailedToast();
        toast.$el.appendTo(this.$el);
        toast.render();
      });
    },
    render_attributes: {
      welcomeToSignal: i18n('welcomeToSignal'),
      selectAContact: i18n('selectAContact'),
    },
    events: {
      click: 'onClick',
    },
    setupLeftPane() {
      if (this.leftPaneView) {
        return;
      }
      this.leftPaneCollapsed=false;
      document.getElementById('toggleGutterCollapseButton').classList.add('gutter-toggle__button-expanded');
      this.leftPaneView = new Whisper.ReactWrapperView({
        className: 'left-pane-wrapper',
        JSX: Signal.State.Roots.createLeftPane(window.reduxStore),
      });

      this.$('.left-pane-placeholder').append(this.leftPaneView.el);

      /* TOGGLE COLLAPSE OF THE LEFT PANE/GUTTER, RESIZING ELEMENTS AS APPROPRIATE */
      function toggleLeftPaneCollapse() {
        if(this.leftPaneCollapsed){

          // pane is collapsed so expand
          document.getElementById('gutter').style.width = null;
          document.querySelector('#gutter > div.left-pane-placeholder > div > div > div.module-left-pane__header > div > div.module-main-header__search').style.display=null;
          document.querySelector('body > div > div.gutter-toggle').style.left=null;
          document.getElementById('toggleGutterCollapseButton').classList.add('gutter-toggle__button-expanded');
          document.getElementById('toggleGutterCollapseButton').classList.remove('gutter-toggle__button-collapsed');

          // Some contacts don't have an avatar...resize the label instead
          Array.from(document.getElementsByClassName('module-avatar__label')).forEach((avatar) => {
            avatar.classList.replace('module-avatar__label--28','module-avatar__label--52');
          });

          // Resize avatars
          Array.from(document.getElementsByClassName('module-avatar')).forEach((avatar) => {
            if(avatar.parentElement.className!=='module-main-header') avatar.classList.replace('module-avatar--28','module-avatar--52');
          });

          // Reposition
          Array.from(document.getElementsByClassName('module-conversation-list-item')).forEach((item) => {
            const currentItem = item;
            currentItem.style.paddingLeft=null; // unset to return to default
          });
          Array.from(document.getElementsByClassName('module-main-header')).forEach((item) => {
            const currentItem = item;
            currentItem.style.paddingLeft=null;
          });

          let prevBottom='0px';
          const height=this.defaultConversationItemHeight;
          Array.from(document.getElementsByClassName('module-left-pane__conversation-container')).forEach((item) => {
            const currentItem = item;
            currentItem.style.height=this.defaultConversationItemHeight;
            currentItem.style.top=prevBottom;
            prevBottom=`${parseInt(prevBottom,10)+parseInt(height,10)}px`;
          });
          this.leftPaneCollapsed=false;
        } else {
          // pane is expanded so collapse
          document.getElementById('gutter').style.width = '42px';
          document.querySelector('#gutter > div.left-pane-placeholder > div > div > div.module-left-pane__header > div > div.module-main-header__search').style.display='none';
          document.querySelector('body > div > div.gutter-toggle').style.left='42px';
          document.getElementById('toggleGutterCollapseButton').classList.remove('gutter-toggle__button-expanded');
          document.getElementById('toggleGutterCollapseButton').classList.add('gutter-toggle__button-collapsed');

          Array.from(document.getElementsByClassName('module-avatar')).forEach((avatar) => {
            avatar.classList.replace('module-avatar--52','module-avatar--28');
          });

          Array.from(document.getElementsByClassName('module-avatar__label')).forEach((avatar) => {
            avatar.classList.replace('module-avatar__label--52','module-avatar__label--28');
          });

          Array.from(document.getElementsByClassName('module-conversation-list-item')).forEach((item) => {
            const currentItem = item;
            currentItem.style.paddingLeft='7px'; // from 16px
          });
          Array.from(document.getElementsByClassName('module-main-header')).forEach((item) => {
            const currentItem = item;
            currentItem.style.paddingLeft='7px'; // from 16px
          });

          let prevBottom='0px';
          const height='46px';
          Array.from(document.getElementsByClassName('module-left-pane__conversation-container')).forEach((item) => {
            const currentItem = item;
            this.defaultConversationItemHeight = currentItem.style.height;
            currentItem.style.height=height;
            currentItem.style.top=prevBottom;
            prevBottom=`${parseInt(prevBottom,10)+parseInt(height,10)}px`;
          });
          this.leftPaneCollapsed=true;
        }
      }

      document.getElementById('toggleGutterCollapseButton').addEventListener('click', toggleLeftPaneCollapse);
      document.querySelector('#gutter').addEventListener('dblclick',toggleLeftPaneCollapse);
    },
    startConnectionListener() {
      this.interval = setInterval(() => {
        const status = window.getSocketStatus();
        switch (status) {
          case WebSocket.CONNECTING:
            break;
          case WebSocket.OPEN:
            clearInterval(this.interval);
            // if we've connected, we can wait for real empty event
            this.interval = null;
            break;
          case WebSocket.CLOSING:
          case WebSocket.CLOSED:
            clearInterval(this.interval);
            this.interval = null;
            // if we failed to connect, we pretend we got an empty event
            this.onEmpty();
            break;
          default:
            // We also replicate empty here
            this.onEmpty();
            break;
        }
      }, 1000);
    },
    onEmpty() {
      this.setupLeftPane();

      const view = this.appLoadingScreen;
      if (view) {
        this.appLoadingScreen = null;
        view.remove();

        const searchInput = document.querySelector(
          '.module-main-header__search__input'
        );
        if (searchInput && searchInput.focus) {
          searchInput.focus();
        }
      }
    },
    onProgress(count) {
      const view = this.appLoadingScreen;
      if (view) {
        view.updateProgress(count);
      }
    },
    focusConversation(e) {
      if (e && this.$(e.target).closest('.placeholder').length) {
        return;
      }

      this.$('#header, .gutter').addClass('inactive');
      this.$('.conversation-stack').removeClass('inactive');
    },
    focusHeader() {
      this.$('.conversation-stack').addClass('inactive');
      this.$('#header, .gutter').removeClass('inactive');
      this.$('.conversation:first .menu').trigger('close');
    },
    reloadBackgroundPage() {
      window.location.reload();
    },
    async openConversation(id, messageId) {
      const conversation = await ConversationController.getOrCreateAndWait(
        id,
        'private'
      );

      const { openConversationExternal } = window.reduxActions.conversations;
      if (openConversationExternal) {
        openConversationExternal(id, messageId);
      }

      this.conversation_stack.open(conversation, messageId);
      this.focusConversation();
    },
    closeRecording(e) {
      if (e && this.$(e.target).closest('.capture-audio').length > 0) {
        return;
      }
      this.$('.conversation:first .recorder').trigger('close');
    },
    onClick(e) {
      this.closeRecording(e);
    },
  });
})();
