export const checkIfFreeUser = (status: string, session: any) => {
  const isLoading = status == "loading";
  const isProUser = Boolean(session?.user?.subId);
  return !isLoading && !isProUser;
};
