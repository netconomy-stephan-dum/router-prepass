import styles from './Loading.scss';
import loading from './loading.gif';

const Loading = {
  tagName: 'div',
  props: {
    className: styles.wrapper,
  },
  children: [
    {
      tagName: 'img',
      props: {
        src: loading,
      },
    },
  ],
};

export default Loading;
