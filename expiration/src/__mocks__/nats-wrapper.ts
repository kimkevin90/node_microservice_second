export const natsWrapper = {
  // client: {
  //   publish: (subject: string, data: string, callback: () => void) => {
  //     callback();
  //   },
  // },
  // jest mock 사용할 시, test 파일에서 netWrapper mock 가져올 수 있다.
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, callback: () => void) => {
        callback();
      }),
  },
};
