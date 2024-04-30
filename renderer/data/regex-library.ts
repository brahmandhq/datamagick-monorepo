export default [
  {
    title: "Whole Numbers",
    regex: "/^\\d+$/",
  },
  {
    title: "Decimal Numbers",
    regex: "/^\\d*\\.\\d+$/",
  },
  {
    title: "Whole + Decimal Numbers",
    regex: "/^\\d*(\\.\\d+)?$/",
  },
  {
    title: "Negative, Positive Whole + Decimal Numbers",
    regex: "/^-?\\d*(\\.\\d+)?$/",
  },
  {
    title: "Whole + Decimal + Fractions",
    regex: "/[-]?[0-9]+[,.]?[0-9]*([\\/][0-9]+[,.]?[0-9]*)*/",
  },
  {
    title: "Alphanumeric without space",
    regex: "/^[a-zA-Z0-9]*$/",
  },
  {
    title: "Alphanumeric with space",
    regex: "/^[a-zA-Z0-9 ]*$/",
  },
  {
    title: "Common email Ids",
    regex: "/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})*$/",
  },
  {
    title: "Uncommon email ids",
    regex: "/^([a-z0-9_\\.\\+-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/",
  },
  {
    title:
      "Complex password (1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and at least 8 characters long)",
    regex:
      "/(?=(.*[0-9]))(?=.*[\\!@#$%^&*()\\\\[\\]{}\\-_+=~`|:;\"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/",
  },
  {
    title:
      "Moderate password (1 lowercase letter, 1 uppercase letter, 1 number, and at least 8 characters long)",
    regex: "/(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/",
  },
  {
    title:
      "Alphanumeric string (may include _ and – having a length of 3 to 16 characters)",
    regex: "/^[a-z0-9_-]{3,16}$/",
  },
  {
    title: "URL with http(s) protocol",
    regex:
      "/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)/",
  },
  {
    title: "URL with protocol optional",
    regex:
      "/(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/",
  },
  {
    title: "IPv4 address",
    regex:
      "/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/",
  },
  {
    title: "IPv6 address",
    regex:
      "/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/",
  },
  {
    title: "Match both IPv4, IPv6 addresses",
    regex:
      "/((^\\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\\s*$)|(^\\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*$))/",
  },
  {
    title: "Date Format YYYY-MM-dd",
    regex: "/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))/",
  },
  {
    title:
      "Date Format dd-MM-YYYY or dd.MM.YYYY or dd/MM/YYYY with check for leap year",
    regex:
      "/^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$/",
  },
  {
    title: "Date Format dd-mmm-YYYY or dd/mmm/YYYY or dd.mmm.YYYY",
    regex:
      "/^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)(?:0?2|(?:Feb))\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$/",
  },
  {
    title: "Time Format HH:MM 12-hour, optional leading 0",
    regex: "/^(0?[1-9]|1[0-2]):[0-5][0-9]$/",
  },
  {
    title: "Time Format HH:MM 12-hour, optional leading 0, Meridiems (AM/PM)",
    regex: "/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/",
  },
  {
    title: "Time Format HH:MM 24-hour with leading 0",
    regex: "/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/",
  },
  {
    title: "Time Format HH:MM 24-hour, optional leading 0",
    regex: "/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/",
  },
  {
    title: "Time Format HH:MM:SS 24-hour",
    regex: "/(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)/",
  },
  {
    title: "Elements with Attributes",
    regex: "/<\\/?[\\w\\s]*>|<.+[\\W]>/",
  },
  {
    title: "Inline JS handler",
    regex: "/\\bon\\w+=\\S+(?=.*>)/",
  },
  {
    title: "Inline JS handler with element",
    regex:
      "/(?:<[^>]+\\s)(on\\S+)=[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']?/",
  },
  {
    title: "Slug",
    regex: "/^[a-z0-9]+(?:-[a-z0-9]+)*$/",
  },
  {
    title: "Search Duplicates",
    regex: "/(\\b\\w+\\b)(?=.*\\b\\1\\b)/",
  },
  {
    title: "International Phone Numbers – with optional country code/extension",
    regex:
      "/^(?:(?:\\(?(?:00|\\+)([1-4]\\d\\d|[1-9]\\d?)\\)?)?[\\-\\.\\ \\\\\\/]?)?((?:\\(?\\d{1,}\\)?[\\-\\.\\ \\\\\\/]?){0,})(?:[\\-\\.\\ \\\\\\/]?(?:#|ext\\.?|extension|x)[\\-\\.\\ \\\\\\/]?(\\d+))?$/",
  },
  {
    title: "File Path with Filename and extension",
    regex:
      "/((\\/|\\\\|\\/\\/|https?:\\\\\\\\|https?:\\/\\/)[a-z0-9 _@\\-^!#$%&+={}.\\/\\\\\\[\\]]+)+\\.[a-z]+$/",
  },
  {
    title: "File Path with optional Filename, extension",
    regex: "/^(.+)/([^/]+)$/",
  },
  {
    title: "File Name with extension having 3 chars",
    regex: "/^[\\w,\\s-]+\\.[A-Za-z]{3}$/",
  },
  {
    title: "Social Security Number",
    regex:
      "/^((?!219-09-9999|078-05-1120)(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\\d{2})\\d{3} (?!00)\\d{2} (?!0{4})\\d{4})|((?!219099999|078051120)(?!666|000|9\\d{2})\\d{3}(?!00)\\d{2}(?!0{4})\\d{4})$/",
  },
  {
    title: "Passport",
    regex: "/^[A-PR-WY][1-9]\\d\\s?\\d{4}[1-9]$/",
  },
].map((item) => ({
  ...item,
  regex: item.regex.slice(1, -1),
  lowercaseTitle: item.title.toLowerCase(),
  key: item.title,
}));
