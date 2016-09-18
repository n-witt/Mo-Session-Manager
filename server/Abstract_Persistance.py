from abc import ABC, abstractmethod

class Abstract_Persistance(ABC):
    @abstractmethod
    def push(self, u_id, urls):
        pass

    @abstractmethod
    def pop(self, u_id):
        pass
