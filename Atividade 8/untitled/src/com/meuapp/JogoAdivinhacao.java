package com.meuapp;

import java.util.Random;
import java.util.Scanner;

public class JogoAdivinhacao {
    public static void main(String[] args) {
        Random random = new Random();
        int numeroEscolhido = random.nextInt(50) + 1;
        Scanner scanner = new Scanner(System.in);
        int palpite;

        System.out.println("Tente adivinhar o número escolhido entre 1 e 50!");

        do {
            System.out.print("Digite seu palpite: ");
            palpite = scanner.nextInt();

            if (palpite < numeroEscolhido) {
                System.out.println("O número é maior.");
            } else if (palpite > numeroEscolhido) {
                System.out.println("O número é menor.");
            } else {
                System.out.println("Parabéns! Você adivinhou o número.");
            }
        } while (palpite != numeroEscolhido);
    }
}
