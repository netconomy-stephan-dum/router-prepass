const inlineRemoteImage = (imageURL: string) =>
  fetch(imageURL)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      return `data:image/webp;base64, ${Buffer.from(buffer).toString('base64')}`;
    });

export default inlineRemoteImage;
