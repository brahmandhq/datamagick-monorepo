import prisma from "lib/prisma";

export const specialStringify = (v) => {
  return JSON.stringify(
    v,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

export const fetchComponent = async (id) => {
  const component = await prisma.component.findFirst({
    where: { id: parseInt(id) },
  });

  return JSON.parse(specialStringify(component));
};

export const getCreateUserQuery = (
  prisma,
  { email, name = "John Doe", picture = "" }
) => {
  return prisma.user.create({
    data: {
      email,
      name,
      image: picture,
    },
  });
};

export const getCreateSubscriptionQuery = (
  prisma,
  { userId, planType, expiryDate }
) => {
  return prisma.subscription.create({
    data: {
      userId,
      planType,
      expiryDate,
    },
  });
};

export const getCreateSubscriptionQueryV2 = (prisma, data) => {
  return prisma.subscription.create({
    data,
  });
};
