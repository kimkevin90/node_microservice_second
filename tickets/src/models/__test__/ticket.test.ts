import { Ticket } from '../ticket';

/*
it('implements optimistic concurrency control', async () => {
 
...
 
  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
*/
it('impltements optimistic concurreny control', async () => {
  // ticket 인스턴스 생성
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  // 티켓 db에 저장
  await ticket.save();

  // ticket fetch twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error('Should not reatch this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
