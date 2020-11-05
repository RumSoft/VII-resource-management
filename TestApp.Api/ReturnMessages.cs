﻿namespace TestApp.Api
{
    public class ReturnMessages
    {
        public const string Message_400_AttributeExists = "Istnieje już atrybut o takiej samej nazwie";
        public const string Message_400_AttributeNotFound = "Nie znaleziono atrybutu";
        public const string Message_400_UserNotExistOrInvalidPassword = "Nie znaleziono użytkownika z takim adresem e-mail i hasłem";
       
        public const string Message_400_InvalidOwner = "Could not verify resource ownership";
        public const string Message_400_ResourceNotFound = "Nie znaleziono zasobu";
        public const string Message_400_TooBigSplitAmount = "Błędna ilość rozdzielenia zasobu";
        public const string Message_Log_TransactionRollback = "Transaction failed, rollbacking";

        public const string Message_400_RoomContainsResources = "Nie można usunąć pokoju gdy ma on przypisane zasoby";
        public const string Message_400_RoomNotFound = "Nie znaleziono pokoju";
        public const string Message_400_RoomAlreadyExists = "Istnieje już pokój o takiej samej nazwie";

        public const string Message_400_UserNotFound = "Nie znaleziono użytkownika";
        public const string Message_400_UserExists = "Istnieje już użytkownik o takiej samej nazwie";
        public const string Message_400_UserCannotResetPassword = "Prośba zresetowania hasła jest niepoprawna";

        public const string Message_418_ValidationFailed = "Prośba zresetowania hasła jest niepoprawna";
    }
}