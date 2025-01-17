package com.meuapp;

import java.util.Scanner;

public class Palindromo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite uma palavra: ");
        String palavra = scanner.nextLine().toLowerCase();

        String palavraInvertida = new StringBuilder(palavra).reverse().toString();

        if (palavra.equals(palavraInvertida)) {
            System.out.println("A palavra é um palíndromo.");
        } else {
            System.out.println("A palavra não é um palíndromo.");
        }
    }
}
